import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { Mover } from '../model/Mover';
import { EdgeCollisions } from '../model/EdgeCollisions';
import { BehaviorSubject } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { PService } from './p.service';
import { NoteGenerator } from '../model/NoteGenerator';

@Injectable({
  providedIn: 'root'
})
export class MoverManagerService {
  boidMovers$: BehaviorSubject<Mover[]> = new BehaviorSubject([]);
  boidEdgeCollisions$: BehaviorSubject<EdgeCollisions[]> = new BehaviorSubject([]);

  planetMovers$: BehaviorSubject<Mover[]> = new BehaviorSubject([]);
  planetEdgeCollisions$: BehaviorSubject<EdgeCollisions[]> = new BehaviorSubject([]);

  planetBoidCollisions$: BehaviorSubject<[number, number][]> = new BehaviorSubject([]);

  constructor(private pService: PService) {
  }

  generatePlanets(count: number, sizeRange: [number, number], canvas: p5.Vector) {
    this.planetMovers$
      .next(
        Array.apply(null, { length: count })
          .map(i => new Mover(canvas, this.pService.p.random(sizeRange[0], sizeRange[1])))
      );

    this.planetEdgeCollisions$
      .pipe(
        withLatestFrom(this.planetMovers$),
        tap(([collisions, planets]) => this.adjustVelocityEdgeCollision(planets, collisions)),
      )
      .subscribe();
  }

  generateBoids(count: number, canvas: p5.Vector) {
    this.boidMovers$
      .next(
        Array.apply(null, { length: count })
          .map(i => new Mover(canvas, 10))
      );

    this.boidEdgeCollisions$
      .pipe(
        withLatestFrom(this.boidMovers$),
        tap(([collisions, boids]) => this.compensateOverlapEdgeCollisions(boids)),
        tap(([collisions, boids]) => this.adjustVelocityEdgeCollision(boids, collisions)),
        tap(([collisions, boids]) => collisions.forEach(_ => {
          if (_.bottom || _.top || _.right || _.left) {
            this.playBoidCollisions();
          }
        }))
      )
      .subscribe();

    this.planetBoidCollisions$
      .pipe(
        withLatestFrom(this.boidMovers$, this.planetMovers$),
        tap(([collisions, boids, planets]) => this.compensateOverlapPlanetBoidCollisions(boids, planets, collisions)),
        tap(([collisions, boids, planets]) => this.adjustVelocityPlanetCollisions(boids, planets, collisions))
      )
      .subscribe();
  }

  generateRandomVector(xLimit: number, yLimit: number) {
    const v = new p5.Vector();
    v.x = this.pService.p.random(-xLimit, xLimit);
    v.y = this.pService.p.random(-yLimit, yLimit);

    return v;
  }

  setRandomVelocity(speed: number) {
    this.boidMovers$.getValue().forEach(m => m.velocity = this.generateRandomVector(speed, speed));
    this.planetMovers$.getValue().forEach(p => p.velocity = this.generateRandomVector(speed / 5, speed / 5));
  }

  setRandomLocations(bounds: p5.Vector) {
    this.boidMovers$.getValue().forEach(m => m.setLocation(
      this.pService.p.random(bounds.x),
      this.pService.p.random(bounds.y))
    );

    this.planetMovers$.getValue().forEach(p => p.setLocation(
      this.pService.p.random(bounds.x),
      this.pService.p.random(bounds.y))
    );
  }

  updateMovers() {
    this.boidMovers$.getValue().forEach(m => m.updateLocation());
    this.boidEdgeCollisions$.next(this.generateEdgeCollisions(this.boidMovers$.getValue()));

    this.planetMovers$.getValue().forEach(p => p.updateLocation());
    this.planetEdgeCollisions$.next(this.generateEdgeCollisions(this.planetMovers$.getValue()));

    this.planetBoidCollisions$.next(this.generatePlanetBoidCollisions(
      this.planetMovers$.getValue(),
      this.boidMovers$.getValue()
    ))

    this.boidMovers$.getValue().forEach(m => this.displayMover(m));
    this.planetMovers$.getValue().forEach(p => this.displayMover(p));
  }

  displayMover(m: Mover) {
    this.pService.p.stroke(10, 10, 10);
    this.pService.p.fill(10, 10, 10);
    this.pService.p.ellipse(m.location.x, m.location.y, m.diameter, m.diameter);
  }

  generatePlanetBoidCollisions(planets: Mover[], boids: Mover[]): [number, number][] {
    const collisions: [number, number][] = [];

    planets.forEach((p, pindex) =>
      boids.forEach((b, bindex) => {
        if (this.isMoverCollision(p, b)) {
          collisions.push([pindex, bindex]);
        }
      })
    );

    return collisions;
  }

  isMoverCollision(m1: Mover, m2: Mover): boolean {
    const diffVector = p5.Vector.sub(m1.location, m2.location);
    const minDiff = m1.radius + m2.radius;

    return (diffVector.mag() <= minDiff);
  }

  generateEdgeCollisions(movers: Mover[]) {
    return movers.map(m => ({
      left: (m.location.x - m.radius <= 0 && m.velocity.x < 0),
      right: (m.location.x + m.radius >= m.bounds.x && m.velocity.x > 0),
      top: (m.location.y - m.radius <= 0 && m.velocity.y < 0),
      bottom: (m.location.y + m.radius >= m.bounds.y && m.velocity.y > 0)
    }));
  }

  compensateOverlapEdgeCollisions(movers: Mover[]) {
    movers.forEach((m, i) => {
      m.location.x = (m.location.x < m.radius)
        ? m.radius
        : (m.location.x > m.bounds.x - m.radius)
          ? m.bounds.x - m.radius
          : m.location.x;

      m.location.y = (m.location.y < m.radius)
        ? m.radius
        : (m.location.y > m.bounds.y - m.radius)
          ? m.bounds.y - m.radius
          : m.location.y;
    });
  }

  adjustVelocityEdgeCollision(movers: Mover[], collisions: EdgeCollisions[]) {
    collisions.forEach((c, i) => {
      movers[i].velocity.x = movers[i].velocity.x * ((c.left || c.right) ? -1 : 1);
      movers[i].velocity.y = movers[i].velocity.y * ((c.top || c.bottom) ? -1 : 1);
    });
  }

  compensateOverlapPlanetBoidCollisions(boids: Mover[], planets: Mover[], collisions: [number, number][]) {
    collisions.forEach(c => this.adjustCollisionPlanetBoidLocation(boids[c[1]], planets[c[0]]));
  }

  adjustCollisionPlanetBoidLocation(boid: Mover, planet: Mover) {
    // from https://processing.org/examples/circlecollision.html

    const distanceVect = p5.Vector.sub(planet.location, boid.location);
    const distanceVectMag = distanceVect.mag();
    const minDistance = boid.radius + planet.radius;
    const distanceCorrection = (minDistance - distanceVectMag) / 2.0;
    const d = distanceVect.copy();
    const correctionVector = d.normalize().mult(distanceCorrection);

    boid.location.sub(correctionVector);
  }

  adjustVelocityPlanetCollisions(boids: Mover[], planets: Mover[], collisions: [number, number][]) { // planetidx, boididx
    collisions.forEach(c => {
      boids[c[1]].velocity.x = -1 * boids[c[1]].velocity.x;
      boids[c[1]].velocity.y = -1 * boids[c[1]].velocity.y;
    });
  }

  playBoidCollisions() {
    const env = new p5.Envelope();
    const osc = new p5.Oscillator();
    const note = this.generateNote();

    osc.setType('sine');
    env.setADSR(0.05, 0.05, 0.5, 0.12);
    env.setRange(0.5, 0);

    osc.amp(0);
    osc.start();
    osc.freq(note);

    env.play(osc);
  }

  generateNote() {
    const gen = new NoteGenerator(this.pService.p);
    const octave = Math.floor(this.pService.p.random(4)) + 3;

    return gen.generateRandomNote('C', 'pentatonic', octave);
  }
}
