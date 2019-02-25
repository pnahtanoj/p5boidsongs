import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

import { Mover } from '../model/Mover';
import { PService } from './p.service';
import { MoverService } from './mover.service';
import { EdgeCollisions } from '../model/EdgeCollisions';
import { withLatestFrom, tap } from 'rxjs/operators';
import { ColorService } from './color.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  collisionOccured$: BehaviorSubject<any> = new BehaviorSubject({});

  planets$: BehaviorSubject<Mover[]> = new BehaviorSubject([]);
  planetWallCollisions$: BehaviorSubject<EdgeCollisions[]> = new BehaviorSubject([]);

  planetColors: p5.Color[] = [];
  planetColorsDestination: p5.Color[] = [];

  constructor(
    private pService: PService,
    private mover: MoverService,
    private color: ColorService
  ) {

    // here?
    this.planetWallCollisions$
      .pipe(
        withLatestFrom(this.planets$),
        tap(([collisions, planets]) => this.planets$.next(this.mover.adjustVelocityEdgeCollision(planets, collisions)))
      )
      .subscribe();
  }

  generateNonOverlapping(count: number, sizeRange: [number, number], canvas: p5.Vector) {
    this.planets$.next(this.mover.generateNonOverlapping(count, sizeRange, canvas));

    this.updateColors();
    this.planetColors = this.planetColorsDestination;
  }

  setRandomSpeeds(max: number) {
    const planets = this.planets$.getValue();
    planets.forEach(p => {
      p.velocity.x = this.pService.p.random(-max, max);
      p.velocity.y = this.pService.p.random(-max, max);
    });
  }

  generateWallCollisions() {
    this.planetWallCollisions$.next(this.mover.generateEdgeCollisions(this.planets$.getValue()));
  }

  generatePlanetCollisions() {
    const planets = this.planets$.getValue();

    planets.forEach((p, i) => {
      planets.forEach((p2, j) => {
        if (i != j) {
          this.mover.checkCollision(p, planets[j]);
        }
      });
    });
  }

  hasWallCollisions() {
    const collisions = this.planetWallCollisions$.getValue();

    for (let i = 0; i < collisions.length; i++) {
      if (collisions[i].bottom || collisions[i].top || collisions[i].left || collisions[i].right) {
        return true
      }
    };

    return false;
  }

  update() {
    this.planets$.getValue().forEach(m => m.updateLocation());
    this.generateWallCollisions();
    this.generatePlanetCollisions();
    if (this.hasWallCollisions()) {
      this.collisionOccured$.next({});
      this.updateColors();
    }
  }

  updateColors() {
    this.planetColorsDestination = this.planets$.getValue().map(p => this.color.getPlanetColor());
  }

  fadeColorsTowardDestination() {
    this.planetColors = this.planetColors.map((c, i) => this.color.migrateColor(c, this.planetColorsDestination[i]));
  }

  display() {
    this.planets$.getValue().forEach((p, i) => {
      this.pService.p.stroke(this.planetColors[i]);
      this.pService.p.fill(this.planetColors[i]);
      this.pService.p.ellipse(p.location.x, p.location.y, p.diameter, p.diameter);
    });
  }
}
