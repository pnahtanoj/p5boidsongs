import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

import { PService } from './p.service';
import { Mover } from '../model/Mover';
import { EdgeCollisions } from '../model/EdgeCollisions';

@Injectable({
  providedIn: 'root'
})
export class MoverService {

  constructor(private pService: PService) { }

  generateNonOverlapping(count: number, sizeRange: [number, number], canvas: p5.Vector) {
    const planets = [];
    let failsafe = 0;

    while (planets.length < count && failsafe < 10000) {
      let overlapping = false;
      const planet = new Mover(canvas, this.pService.p.random(sizeRange[0], sizeRange[1]));

      planet.location.x = this.pService.p.random(planet.radius, canvas.x - planet.radius);
      planet.location.y = this.pService.p.random(planet.radius, canvas.y - planet.radius);

      planets.forEach(p => {
        if (this.isOverlapping(p, planet)) {
          overlapping = true;
        }
      });

      if (!overlapping) {
        planets.push(planet);
      }

      failsafe++;
    }

    return planets;
  }

  isOverlapping(m1: Mover, m2: Mover): boolean {
    const diffVector = p5.Vector.sub(m1.location, m2.location);
    const minDiff = m1.radius + m2.radius;

    return (diffVector.mag() < minDiff + 1);
  }

  generateEdgeCollisions(movers: Mover[]) {
    return movers.map(m => ({
      left: (m.location.x - m.radius <= 0 && m.velocity.x < 0),
      right: (m.location.x + m.radius >= m.bounds.x && m.velocity.x > 0),
      top: (m.location.y - m.radius <= 0 && m.velocity.y < 0),
      bottom: (m.location.y + m.radius >= m.bounds.y && m.velocity.y > 0)
    }));
  }

  adjustVelocityEdgeCollision(movers: Mover[], collisions: EdgeCollisions[]) {
    return collisions.map((c, i) => {
      const m: Mover = movers[i];

      m.velocity.x = m.velocity.x * ((c.left || c.right) ? -1 : 1);
      m.velocity.y = m.velocity.y * ((c.top || c.bottom) ? -1 : 1);

      return m;
    });
  }

  checkCollision(m: Mover, other: Mover) {
    // Get distances between the balls components
    const distanceVect = p5.Vector.sub(other.location, m.location);

    // Calculate magnitude of the vector separating the balls
    const distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    const minDistance = m.radius + other.radius;

    if (distanceVectMag < minDistance) {
      // he splits diff between movers...
      const distanceCorrection = (minDistance - distanceVectMag) / 2.0;
      const d = distanceVect.copy();
      const correctionVector = d.normalize().mult(distanceCorrection);
      other.location.add(correctionVector);
      m.location.sub(correctionVector);

      // get angle of distanceVect
      const theta = distanceVect.heading();
      // precalculate trig values
      const sine = this.pService.p.sin(theta);
      const cosine = this.pService.p.cos(theta);

      /* bTemp will hold rotated ball positions. You
       just need to worry about bTemp[1] position*/
      const bTemp: p5.Vector[] = [
        new p5.Vector(), new p5.Vector()
      ];

      /* this ball's position is relative to the other
       so you can use the vector between them (bVect) as the
       reference point in the rotation expressions.
       bTemp[0].position.x and bTemp[0].position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
      bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
      bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

      // rotate Temporary velocities
      const vTemp: p5.Vector[] = [
        new p5.Vector(), new p5.Vector()
      ]

      vTemp[0].x = cosine * m.velocity.x + sine * m.velocity.y;
      vTemp[0].y = cosine * m.velocity.y - sine * m.velocity.x;
      vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
      vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate
       the final velocity along the x-axis. */
      const vFinal: p5.Vector[] = [
        new p5.Vector(), new p5.Vector()
      ];

      // final rotated velocity for b[0]
      vFinal[0].x = ((m.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (m.m + other.m);
      vFinal[0].y = vTemp[0].y;

      // final rotated velocity for b[0]
      vFinal[1].x = ((other.m - m.m) * vTemp[1].x + 2 * m.m * vTemp[0].x) / (m.m + other.m);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate ball positions and velocities back
       Reverse signs in trig expressions to rotate
       in the opposite direction */
      // rotate balls
      const bFinal: p5.Vector[] = [
        new p5.Vector(), new p5.Vector()
      ];

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update balls to screen position
      other.location.x = m.location.x + bFinal[1].x;
      other.location.y = m.location.y + bFinal[1].y;

      m.location.add(bFinal[0]);

      // update velocities
      m.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
      m.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
      other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
      other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
    }
  }
}
