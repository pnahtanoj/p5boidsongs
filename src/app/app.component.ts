import { Component } from '@angular/core';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { Mover } from './model/Mover';
import { BoidMover } from './model/BoidMover';

const canvas: p5.Vector = new p5.Vector();
canvas.x = 1200;
canvas.y = 800;

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

  ngOnInit() {
    this.createCanvas();
  }

  private createCanvas() {
    this.p5 = new p5(this.sketch);
  }

  private sketch(p: any) {
    // objects
    let movers: Mover[] = [];
    let planets: Mover[] = [];

    // controls
    let countSlider, speedSlider;
    let prevSpeed = 0;

    p.setup = () => {
      p.createCanvas(canvas.x, canvas.y);

      countSlider = p.createSlider(1, topCount, startingMoverCount);
      countSlider.position(countSliderLocation.x + 20, countSliderLocation.y);

      speedSlider = p.createSlider(1, topSpeed, startingSpeed);
      speedSlider.position(speedSliderLocation.x + 20, speedSliderLocation.y);

      planets.push(new Mover(p, canvas, 150))
      planets.push(new Mover(p, canvas, 200))
      planets.push(new Mover(p, canvas, 250))
      planets[0].setSpeed(convertSpeed(1))
      planets[1].setSpeed(convertSpeed(1))
      planets[2].setSpeed(convertSpeed(1))
    };

    p.draw = () => {
      p.background(200);

      const count = countSlider.value();
      const currSpeed = speedSlider.value();

      if (count != movers.length) {
        movers = updatedMoverList(count - movers.length);
        movers.forEach(m => m.setSpeed(convertSpeed(currSpeed)));
      }

      if (prevSpeed !== currSpeed) {
        movers.forEach(m => m.setSpeed(convertSpeed(currSpeed)));
      }

      movers.forEach(m => m.update())
      planets.forEach(m => m.update());

      updateControls(p);
      prevSpeed = speedSlider.value();
    };

    function convertSpeed(speed: number): number {
      return speed / 10;
    }

    function updateControls(p: any) {
      p.textSize(25);
      p.textAlign(p.RIGHT, p.CENTER);
      p.fill(0);
      p.stroke(0);
      p.text('movers', countSliderLocation.x, countSliderLocation.y);
      p.text('speed', speedSliderLocation.x, speedSliderLocation.y);
    }

    function updatedMoverList(diff: number): Mover[] {
      if (diff < 0) {
        return [...movers.slice(0, movers.length + diff)];
      } else {
        return [...movers, ...generateMovers(diff, convertSpeed(speedSlider.value()))];
      }
    }

    function generateMovers(count: number, speed: number) {
      return Array.apply(null, { length: count })
        .map(i => new BoidMover(p, canvas, 10));
    }
  }
}
