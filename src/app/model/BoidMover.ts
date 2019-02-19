import * as p5 from 'p5';

import { Mover } from './Mover';
import { NoteGenerator } from './NoteGenerator';

export class BoidMover extends Mover {
  env = new p5.Envelope();
  osc = new p5.Oscillator();

  constructor(p: any, canvas: p5.Vector, radius: number = 50) {
    super(p, canvas, radius);
  }

  changeDirectionOccured(x, y) {
    this.osc.setType('sine');
    this.env.setADSR(0.05, 0.05, 0.5, 0.12);
    this.env.setRange(0.5, 0);

    this.osc.amp(0);
    this.osc.start();
    this.osc.freq(this.generateNote());

    this.env.play(this.osc);
  }

  generateNote() {
    const gen = new NoteGenerator(this.p);
    const octave = Math.floor(this.p.random(4)) + 3;

    return gen.generateRandomNote('C', 'pentatonic', octave);
  }
}
