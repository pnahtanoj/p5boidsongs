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
    beforeEach(() => {
    });

    it('out left wall', () => {
      m = new Mover(p5, bounds, 10);
    });
  });
});
