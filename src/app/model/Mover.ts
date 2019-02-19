import * as p5 from 'p5';
import { NoteGenerator } from './NoteGenerator';

export class Mover {
  p: any;
  bounds: p5.Vector;
  radius: number;
  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;

  topspeed = 10;
  r = 0;
  g = 0;
  b = 0;

  // env = new p5.Envelope();
  // osc = new p5.Oscillator();

  constructor(
    p: any,
    private canvas: p5.Vector,
    radius: number = 50) {

    this.p = p;
    this.bounds = canvas.copy();
    this.radius = radius;

    this.location = new p5.Vector();
    this.velocity = new p5.Vector();
    this.acceleration = new p5.Vector();

    this.location.x = this.p.random(this.bounds.x);
    this.location.y = this.p.random(this.bounds.y);

    this.setSpeed(0);
    this.setAcceleration();
  }

  setSpeed(speed: number) {
    this.velocity.x = this.p.random(-speed, speed);
    this.velocity.y = this.p.random(-speed, speed);
  }

  setAcceleration() {
    this.acceleration.x = this.p.random(-0.01, 0.01);
    this.acceleration.y = this.p.random(-0.01, 0.01);
    this.acceleration.mult(0.1);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    this.velocity.limit(this.topspeed);

    this.checkEdgesClosed();
    this.display();
  }

  display() {
    this.p.stroke(this.r, this.g, this.b);
    this.p.fill(this.r, this.g, this.b);
    this.p.ellipse(this.location.x, this.location.y, this.radius, this.radius);
  }

  checkEdgesClosed() {
    const switchX = (
      (this.location.x + this.radius >= this.bounds.x && this.velocity.x > 0) ||
      (this.location.x - this.radius <= 0 && this.velocity.x < 0)
    );

    const switchY = (
      (this.location.y + this.radius >= this.bounds.y && this.velocity.y > 0) ||
      (this.location.y - this.radius <= 0 && this.velocity.y < 0)
    );

    this.velocity.x = switchX
      ? this.velocity.x * -1
      : this.velocity.x;

    this.velocity.y = switchY
      ? this.velocity.y * -1
      : this.velocity.y;

    if (switchX) {
      console.log(`SWITCH X: ${this.location.x} ${this.radius} ${this.bounds.x} `)
    }

    if (switchY) {
      console.log(`SWITCH Y: ${this.location.y} ${this.radius} ${this.bounds.y} `)
    }

    if (switchX || switchY) {
      this.changeDirectionOccured(switchX, switchY);
    }
  }

  changeDirectionOccured(x, y) {
  }

  changeColor() {
    this.r = this.p.random(255);
    this.g = this.p.random(255);
    this.b = this.p.random(255);
  }
}
