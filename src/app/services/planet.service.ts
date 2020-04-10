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
import { Notes, NumberToNotes } from '../model/Notes';
import { NoteService } from '../service/note.service';
import { Scale } from '../model/Scale';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  collisionOccured$: BehaviorSubject<any> = new BehaviorSubject({});

  planets$: BehaviorSubject<Mover[]> = new BehaviorSubject([]);
  planetWallCollisions$: BehaviorSubject<EdgeCollisions[]> = new BehaviorSubject([]);
  planetCollisions: boolean = false; // [number, number][] = [];
  planetColors: p5.Color[] = [];
  planetColorsDestination: p5.Color[] = [];

  planetNotes: number[] = [];
  planetNotesDestination: number[] = [];
  planetNotePlayers: any[] = [];

  currentKey: string = 'A';
  currentScale: Scale = 'major';

  noiseOffset = 0.1;

  constructor(
    private pService: PService,
    private mover: MoverService,
    private color: ColorService,
    private notes: NoteService
  ) {

    // here?
    this.planetWallCollisions$
      .pipe(
        withLatestFrom(this.planets$),
        tap(([collisions, planets]) => this.planets$.next(this.mover.adjustVelocityEdgeCollision(planets, collisions)))
      )
      .subscribe();
  }

  initKey() {
    this.setKey(this.currentKey, this.currentScale);
    this.planetNotes = [...this.planetNotesDestination];
    this.planetNotePlayers = this.planetNotes.map(note => {
      // const env = new p5.Envelope();
      const osc = new p5.Oscillator();
      const filter = new p5.LowPass();

      filter.freq(400);
      filter.res(2);

      osc.setType('triangle');
      osc.amp(0.5);
      osc.disconnect();
      osc.connect(filter);
      osc.pan(0, 0);
      osc.start();
      osc.freq(note);

      return {
        osc,
        filter,
        note
      }
    });
  }

  setKey(key: string, scale: Scale) {
    this.currentKey = key;
    this.currentScale = scale;

    const inversions = [[1, 3, 5], [1, 5, 3], [3, 5, 1], [3, 1, 5], [5, 1, 3], [5, 3, 1]];
    const selectedInversion = inversions[Math.floor(this.pService.p.random(1, 4))];

    this.planetNotesDestination[0] = this.notes.getFrequency(this.currentKey, this.currentScale, selectedInversion[0], this.pService.p.random(4, 6));
    this.planetNotesDestination[1] = this.notes.getFrequency(this.currentKey, this.currentScale, selectedInversion[1], this.pService.p.random(4, 6));
    this.planetNotesDestination[2] = this.notes.getFrequency(this.currentKey, this.currentScale, selectedInversion[2], this.pService.p.random(4, 6));
  }

  getPan(p: Mover) {
    return this.pService.p.map(p.location.x + p.location.y, 0, 2400, -1, 1);
  }

  getAmplitude(p: Mover) {
    return this.pService.p.map(p.location.x + p.location.y, 0, 2400, 0.0, 0.999);
  }

  getFilterValue(p: Mover) {
    this.noiseOffset += 0.1;
    const newFrequency = this.pService.p.map(this.pService.p.noise(p.location.x + this.noiseOffset, p.location.y + this.noiseOffset), 0, 1, 200, 500);
    return newFrequency;
  }

  changeInversion() {
    this.setKey(this.currentKey, this.currentScale);
  }

  baseNote(note: number) {
    return note % 12;
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
    this.planetCollisions = false;

    planets.forEach((p, i) => {
      planets.forEach((p2, j) => {
        if (i != j) {
          if (this.mover.checkCollision(p, planets[j])) {
            this.planetCollisions = true;
          }
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
    this.updateNotes();

    if (this.hasWallCollisions()) {
      this.collisionOccured$.next({});
      this.updateColors();
      this.changeKey();
    }

    if (this.planetCollisions) {
      this.changeInversion();
      this.updateColors();
    }
  }

  updateFilters() {
    this.planetNotePlayers.forEach((p, i) => {
      const planet = this.planets$.getValue()[i];
      p.filter.freq(this.getFilterValue(planet));
      p.osc.amp(this.getAmplitude(planet));
      p.osc.pan(this.getPan(planet));
    });
    console.log('');
  }

  updateColors() {
    this.planetColorsDestination = this.planets$.getValue().map(p => this.color.getPlanetColor());
  }

  updateNotes() {
    this.planetNotePlayers.forEach((p, i) => p.osc.freq(this.planetNotes[i]));
  }

  changeKey() {
    const newKey = Math.floor(this.pService.p.random(0, 12));
    const newScale = (Math.floor(this.pService.p.random(0, 2)) === 0) ? 'major' : 'minor';

    console.log(`CHANGE KEY: ${NumberToNotes[newKey]} ${newScale}`)
    this.setKey(NumberToNotes[newKey], newScale);
  }

  fadeColorsTowardDestination() {
    this.planetColors = this.planetColors.map((c, i) => this.color.migrateColor(c, this.planetColorsDestination[i]));
  }

  fadeNotesTowardDestination() {
    const diff = 6;

    this.planetNotes = this.planetNotes.map((n, i) => {
      if (this.planetNotes[i] < this.planetNotesDestination[i]) {
        return (this.planetNotes[i] + diff) < this.planetNotesDestination[i] ? this.planetNotes[i] + diff : this.planetNotesDestination[i];
      } else if (this.planetNotes[i] > this.planetNotesDestination[i]) {
        return (this.planetNotes[i] - diff) > this.planetNotesDestination[i] ? this.planetNotes[i] - diff : this.planetNotesDestination[i];
      } else {
        return this.planetNotes[i];
      }
    });
  }

  display() {
    this.planets$.getValue().forEach((p, i) => {
      this.pService.p.stroke(this.planetColors[i]);
      this.pService.p.fill(this.planetColors[i]);
      this.pService.p.ellipse(p.location.x, p.location.y, p.diameter, p.diameter);
    });
  }
}
