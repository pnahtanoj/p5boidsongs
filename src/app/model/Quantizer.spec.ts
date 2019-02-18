import { Quantizer } from "./Quantizer";
import { ScaleNotes } from './Scale';

describe('Quantizer', () => {
  let q;
  let scale;

  beforeEach(() => {
    q = new Quantizer();
  });

  describe('getClosestSemitone', () => {
    beforeEach(() => {
      scale = ScaleNotes['pentatonic'];
    });

    it('pentatonic', () => {
      expect(q.getClosestSemitone(0, scale)).toBe(0);
      expect(q.getClosestSemitone(1, scale)).toBe(0);
      expect(q.getClosestSemitone(1.0001, scale)).toBe(2);
      expect(q.getClosestSemitone(3, scale)).toBe(2);
      expect(q.getClosestSemitone(3.001, scale)).toBe(4);
      expect(q.getClosestSemitone(5.5, scale)).toBe(4);
      expect(q.getClosestSemitone(5.5001, scale)).toBe(7);
      expect(q.getClosestSemitone(8, scale)).toBe(7);
      expect(q.getClosestSemitone(8.0001, scale)).toBe(9)
      expect(q.getClosestSemitone(10.5, scale)).toBe(9)
      // expect(q.getClosestSemitone(10.51, scale)).toBe(12)
    });
  });
});
