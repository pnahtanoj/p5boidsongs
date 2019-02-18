import * as p5 from 'p5';
import { NoteGenerator } from './NoteGenerator';

export class Mover {
  p: any;
  bounds: p5.Vector;

  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;

  topspeed = 10;
  size = 10;
  r = 0;
  g = 0;
  b = 0;

  // env = new p5.Envelope();
  // osc = new p5.Oscillator();

  constructor(
    p: any,
    private canvas: p5.Vector) {

    this.p = p;
    this.bounds = canvas.copy();

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
    this.p.ellipse(this.location.x, this.location.y, this.size, this.size);
  }

  checkEdgesClosed() {
    const switchX = (this.location.x > this.bounds.x || this.location.x < 0);
    const switchY = (this.location.y > this.bounds.y || this.location.y < 0);
    this.velocity.x = switchX
      ? this.velocity.x * -1
      : this.velocity.x;

    this.velocity.y = switchY
      ? this.velocity.y * -1
      : this.velocity.y;

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
