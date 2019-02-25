import * as p5 from 'p5';

export class Mover {
  bounds: p5.Vector;
  diameter: number;
  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  m: number; // mass

  constructor(
    private canvas: p5.Vector,
    diameter: number = 50
  ) {

    this.bounds = canvas.copy();
    this.diameter = diameter;

    this.location = new p5.Vector();
    this.velocity = new p5.Vector();
    this.acceleration = new p5.Vector();
    this.m = this.radius * .1;

    this.setLocation();
    //     // if (this.diameter >= 150) {
    //     //   console.log(`${(x - this.radius < 0)} ${(x + this.radius > this.bounds.x)} ${(y - this.radius < 0)} ${(y + this.radius > this.bounds.y)}`);
    //     //   console.log(this.radius);
    //     // }

    //     this.setSpeed(0);
    //     this.setAcceleration();
  }

  get radius(): number {
    return this.diameter / 2;
  }

  setLocation(x = 0, y = 0) {
    this.location.x = (x - this.radius < 0)
      ? 0 + + this.radius
      : ((x + this.radius > this.bounds.x))
        ? this.bounds.x - this.radius
        : x;

    this.location.y = (y - this.radius < 0)
      ? 0 + this.radius
      : ((y + this.radius > this.bounds.y))
        ? this.bounds.y - this.radius
        : y;

  }
  // setVelocity(v: p5.Vector) {
  //     this.velocity.x = this.p.random(-speed, speed);
  //     this.velocity.y = this.p.random(-speed, speed);
  // }

  //   setAcceleration() {
  //     this.acceleration.x = this.p.random(-0.01, 0.01);
  //     this.acceleration.y = this.p.random(-0.01, 0.01);
  //     this.acceleration.mult(0.1);
  //   }

  updateLocation() {
    //     this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    // console.log(`${this.location} ${this.velocity}`)
    //     this.velocity.limit(this.topspeed);

    //     this.checkEdgesClosed();
    // this.display();
  }

  //   display() {
  //     this.p.stroke(this.r, this.g, this.b);
  //     this.p.fill(this.r, this.g, this.b);
  //     this.p.ellipse(this.location.x, this.location.y, this.diameter, this.diameter);
  //   }

  //   checkEdgesClosed() {
  //     const switchX = (
  //       (this.location.x + this.radius >= this.bounds.x && this.velocity.x > 0) ||
  //       (this.location.x - this.radius <= 0 && this.velocity.x < 0)
  //     );

  //     const switchY = (
  //       (this.location.y + this.radius >= this.bounds.y && this.velocity.y > 0) ||
  //       (this.location.y - this.radius <= 0 && this.velocity.y < 0)
  //     );

  //     this.velocity.x = switchX
  //       ? this.velocity.x * -1
  //       : this.velocity.x;

  //     this.velocity.y = switchY
  //       ? this.velocity.y * -1
  //       : this.velocity.y;

  //     // if (this.radius >= 150) {
  //     //   if (switchX) {
  //     //     console.log(`SWITCH X: ${this.location.x} ${this.radius} ${this.bounds.x} `)
  //     //   }

  //     //   if (switchY) {
  //     //     console.log(`SWITCH Y: ${this.location.y} ${this.radius} ${this.bounds.y} `)
  //     //   }
  //     // }

  //     if (switchX || switchY) {
  //       this.changeDirectionOccured(switchX, switchY);
  //     }
  //   }

  //   changeDirectionOccured(x, y) {
  //   }

  //   changeColor() {
  //     this.r = this.p.random(255);
  //     this.g = this.p.random(255);
  //     this.b = this.p.random(255);
  //   }
}

