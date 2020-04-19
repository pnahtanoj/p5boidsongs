import { TestBed } from '@angular/core/testing';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

import { MoverManagerService } from './mover-manager.service';
import { Mover } from '../model/Mover';

describe('MoverManagerService', () => {
  let service: MoverManagerService;
  let canvas: p5.Vector;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(MoverManagerService);
  });

  beforeEach(() => {
    canvas = new p5.Vector();
    canvas.x = 100;
    canvas.y = 100;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isMoverCollision', () => {
    let m1;
    let m2;

    beforeEach(() => {
      m1 = new Mover(canvas, 10); // diameters...
      m2 = new Mover(canvas, 50);
    });

    it('same location', () => {
      m1.location.x = 10;
      m1.location.y = 10;
      m2.location.x = 10;
      m2.location.y = 10;

      expect(service.isMoverCollision(m1, m2)).toBeTruthy();
    });

    it('edge touching', () => {
      m1.location.x = 10;
      m1.location.y = 10;

      m2.location.x = 10;
      m2.location.y = 40;

      expect(service.isMoverCollision(m1, m2)).toBeTruthy();
    });

    it('edge not touching', () => {
      m1.location.x = 10;
      m1.location.y = 10;
      m2.location.x = 10;
      m2.location.y = 41;

      expect(service.isMoverCollision(m1, m2)).toBeFalsy();
    });
  });

  describe('preventOverlapEdgeCollisions', () => {
    let m1;
    let m2;
    let movers;

    beforeEach(() => {
      m1 = new Mover(canvas, 10);
      m2 = new Mover(canvas, 10);
      movers = [m1, m2];
    });

    it('adjusts x out of bounds left', () => {
      m1.location.x = m1.radius;
      m2.location.x = m2.radius;

      service.compensateOverlapEdgeCollisions(movers);

      expect(m1.location.x).toBe(m1.radius);
      expect(m2.location.x).toBe(m2.radius);
    });

    it('adjusts x out of bounds right', () => {
      m1.location.x = m1.bounds.x - m1.radius + 1;
      m2.location.x = m1.bounds.x - m1.radius

      service.compensateOverlapEdgeCollisions(movers);

      expect(m1.location.x).toBe(m1.bounds.x - m1.radius);
      expect(m2.location.x).toBe(m2.bounds.x - m2.radius);
    });

    it('adjusts y out of bounds top', () => {
      m1.location.y = m1.radius - 1;
      m2.location.y = m2.radius;

      service.compensateOverlapEdgeCollisions(movers);

      expect(m1.location.y).toBe(m1.radius);
      expect(m2.location.y).toBe(m2.radius);
    });

    it('adjusts y out of bounds bottom', () => {
      m1.location.y = m1.bounds.y - m1.radius + 1;
      m2.location.y = m2.bounds.y - m2.radius

      service.compensateOverlapEdgeCollisions(movers);

      expect(m1.location.y).toBe(m1.bounds.y - m1.radius);
      expect(m2.location.y).toBe(m2.bounds.y - m2.radius);
    });
  });

  describe('adjustCollisionPlanetBoidLocation', () => {
    let b;
    let p;

    beforeEach(() => {
      b = new Mover(canvas, 10); // diameter, r = 5
      p = new Mover(canvas, 10);
    });

    xit('adjust overlap', () => {
      // should be 45deg
      b.location.x = 11;
      b.location.y = 10;

      p.location.x = 15;
      p.location.y = 10;

      service.adjustCollisionPlanetBoidLocation(b, p);

      expect(b.location.x).toBe(10);
      expect(b.location.y).toBe(10);
    });
  });

});
