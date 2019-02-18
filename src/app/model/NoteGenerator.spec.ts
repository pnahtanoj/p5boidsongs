import { NoteGenerator } from './NoteGenerator';
import { NoteTree } from './Notes';

describe('Quantizer', () => {
  let n, p;

  const pMock = {
    random() { return 0; }
  }
  beforeEach(() => {
    n = new NoteGenerator(pMock);
    p = pMock;
  });

  describe('generateRandomNote', () => {
    // describe('pent', () => {
      // xit('0 low', () => {
      //   spyOn(p, 'random').and.returnValue(-100);
      //   expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[0][0])
      // });

      describe('random 0', () => {
        beforeEach(()  => {
          spyOn(p, 'random').and.returnValue(0);
        });

        it('', () => {
          expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[0][0])
          expect(n.generateRandomNote('D', 'major', 0)).toBe(NoteTree[2][0])
          expect(n.generateRandomNote('Bb', 'major', 0)).toBe(NoteTree[10][0])
          expect(n.generateRandomNote('G', 'chromatic', 0)).toBe(NoteTree[7][0])
        });
      });

      // it('2 low', () => {
      //   spyOn(p, 'random').and.returnValue(1.001);
      //   expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[2][0])
      // });

      // it('2 high', () => {
      //   spyOn(p, 'random').and.returnValue(2.999);
      //   expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[2][0])
      // });

      // it('4 low', () => {
      //   spyOn(p, 'random').and.returnValue(3.1);
      //   expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[4][0])
      // });

      // it('4 high', () => {
      //   spyOn(p, 'random').and.returnValue(5.5);
      //   expect(n.generateRandomNote('C', 'pentatonic', 0)).toBe(NoteTree[4][0])
      // });
    });
  // });

});
