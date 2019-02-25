import { Mover } from './Mover';
import * as p5 from 'p5';

describe('Mover', () => {
  let m;
  let bounds;

  beforeEach(() => {
    bounds = new p5.Vector();
    bounds.x = 100;
    bounds.y = 100;
    // m = new Mover();
  });

  describe('cannot construct out of bounds', () => {
    const diameter = 10;
    const radius = diameter / 2;

    beforeEach(() => {
      m = new Mover(bounds, diameter);
    });

    it('out left wall', () => {
      m.setLocation(-10, 50);
      expect(m.location.x).toBe(radius);
    });

    it('outside right wall', () => {
      m.setLocation(bounds.x + 10);
      expect(m.location.x).toBe(bounds.x - (radius));
    });

    it('out top wall', () => {
      m.setLocation(50, 0);
      expect(m.location.y).toBe(radius);
    });

    it('outside bottom wall', () => {
      m.setLocation(50, bounds.y);
      expect(m.location.y).toBe(bounds.y - radius);
    });
  });
});
