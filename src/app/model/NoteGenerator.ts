import { NoteTree, Notes } from './Notes';
import { ScaleNotes, Scale } from './Scale';

export class NoteGenerator {
  constructor(private p: any) { }

  generateRandomNote(key: string, scale: Scale, octave: number) {
    const scaleNotes = ScaleNotes[scale];
    const noteInScale = scaleNotes[Math.floor(this.p.random(scaleNotes.length))];

    // console.log(`GRN: ${scaleNotes} ${noteInScale} ${octave}`);

    return NoteTree[noteInScale + Notes[key]][octave];
  }
}
