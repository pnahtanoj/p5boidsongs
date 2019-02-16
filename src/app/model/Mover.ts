import { Vector } from 'p5';

export class Mover {
  bounds: Vector;

  location: Vector;
  velocity: Vector;
  acceleration: Vector;

  topspeed = 10;
  size = 10;

  constructor(
    private p: any,
    private canvas: Vector) {

    this.p = p;
    this.bounds = canvas.copy();

    this.location = new Vector();
    this.velocity = new Vector();
    this.acceleration = new Vector();

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
    // this.acceleration = Vector.random2D();
    // this.acceleration.mult(0.1);
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    this.velocity.limit(this.topspeed);

    this.checkEdgesClosed();
    this.display();
  }

  display() {
    this.p.stroke(0);
    this.p.fill(0);
    this.p.ellipse(this.location.x, this.location.y, this.size, this.size);
  }

  checkEdgesClosed() {
    this.velocity.x = (this.location.x > this.bounds.x || this.location.x < 0)
      ? this.velocity.x * -1
      : this.velocity.x;

    this.velocity.y = (this.location.y > this.bounds.y || this.location.y < 0)
      ? this.velocity.y * -1
      : this.velocity.y;
  }

  checkEdges() {
    this.location.x = (this.location.x > this.bounds.x)
      ? 0
      : (this.location.x < 0)
        ? (this.bounds.x)
        : this.location.x;

    this.location.y = (this.location.y > this.bounds.y)
      ? 0
      : (this.location.y < 0)
        ? (this.bounds.y)
        : this.location.y;
  }
}
