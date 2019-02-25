import { Component } from '@angular/core';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { PService } from './services/p.service';
import { MoverManagerService } from './services/mover-manager.service';
import { PlanetService } from './services/planet.service';
import { ColorService } from './services/color.service';
import { tap, skip } from 'rxjs/operators';

const canvas: p5.Vector = new p5.Vector();
canvas.x = 1600;
canvas.y = 850;

const countSliderLocation: p5.Vector = new p5.Vector();
countSliderLocation.x = canvas.x - 170;
countSliderLocation.y = canvas.y - 50;

const speedSliderLocation: p5.Vector = new p5.Vector();
speedSliderLocation.x = canvas.x - 170;
speedSliderLocation.y = canvas.y - 100;

const topCount = 40;
const startingMoverCount = 10;
const startingSpeed = 20;
const topSpeed = 30;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  p5: any;
  closure = 'TETING!@';

  bg: p5.Color;
  bgDestination: p5.Color;

  constructor(
    private pService: PService,
    private movers: MoverManagerService,
    private planets: PlanetService,
    private color: ColorService
  ) {
  }

  ngOnInit() {
    this.createCanvas();
  }

  private createCanvas() {
    this.p5 = new p5(this.sketch.bind(this));
  }

  private sketch(p: any) {
    this.pService.p = p;

    const one = new p5.Vector();

    // controls
    let countSlider, speedSlider;
    let prevSpeed = 0;

    p.setup = () => {
      this.color.initializePalette();

      this.bg = this.color.getFloorColor();
      this.bgDestination = this.bg;

      this.planets.collisionOccured$
        .pipe(
          skip(1),
          tap(c => this.bgDestination = this.color.getFloorColor()))
        .subscribe()

      this.planets.generateNonOverlapping(3, [150, 250], canvas);
      this.planets.setRandomSpeeds(0.2);

      p.createCanvas(canvas.x, canvas.y);

      // countSlider = p.createSlider(1, topCount, startingMoverCount);
      // countSlider.position(countSliderLocation.x + 20, countSliderLocation.y);

      // speedSlider = p.createSlider(1, topSpeed, startingSpeed);
      // speedSlider.position(speedSliderLocation.x + 20, speedSliderLocation.y);
    };

    p.draw = () => {
      p.background(this.bg);

      this.planets.update();

      if (p.frameCount % 80) {
        this.planets.fadeColorsTowardDestination();
        this.bg = this.color.migrateColor(this.bg, this.bgDestination);
      }

      this.planets.display();

      // const count = countSlider.value();
      // const currSpeed = speedSlider.value();

      // this.movers.updateMovers();

      // if (count != this.movers.length) {
      //   this.movers = this.updatedMoverList(p, count - this.movers.length);
      //   this.movers.forEach(m => m.setSpeed(this.convertSpeed(currSpeed)));
      // }

      // if (prevSpeed !== currSpeed) {
      //   this.movers.forEach(m => m.setSpeed(this.convertSpeed(currSpeed)));
      // }

      // this.movers.forEach(m => m.update())
      // this.planets.forEach(m => m.update());

      // updateControls(p);
      // prevSpeed = speedSlider.value();
    };

    function updateControls(p: any) {
      p.textSize(25);
      p.textAlign(p.RIGHT, p.CENTER);
      p.fill(0);
      p.stroke(0);
      p.text('movers', countSliderLocation.x, countSliderLocation.y);
      p.text('speed', speedSliderLocation.x, speedSliderLocation.y);
    }

  }

  // convertSpeed(speed: number): number {
  //   return speed / 10;
  // }

  // generateMovers(p: any, count: number, speed: number) {
  //   return Array.apply(null, { length: count })
  //     .map(i => new BoidMover(p, canvas, 10))
  // }

  // updatedMoverList(p: any, diff: number): Mover[] {
  //   if (diff < 0) {
  //     return [...this.movers.slice(0, this.movers.length + diff)];
  //   } else {
  //     return [...this.movers, ...this.generateMovers(p, diff, this.convertSpeed(5))];
  //     // return [...this.movers, ...this.generateMovers(diff, this.convertSpeed(speedSlider.value()))];
  //   }
  // }
}
