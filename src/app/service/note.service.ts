import { Injectable } from '@angular/core';
import { Scale, ScaleNotes } from '../model/Scale';
import { Notes } from '../model/Notes';
import { PService } from '../services/p.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private pService: PService) { }

  getFrequency(key: string, scale: Scale, step: number, octave: number) { // default root
    const noteStep = ScaleNotes[scale][step - 1];
    const keyOffset = Notes[key];
    const normalizedNote = (noteStep + keyOffset) % 12;

    // console.log(`FREQ: ${key} ${scale} ${step}`)
    // console.log(`FREQ: ${noteStep} ${keyOffset} ${normalizedNote} ${Math.floor(octave)}`)
    // console.log(`FREQ: ${normalizedNote + (12 * Math.floor(octave))}`)

    return this.pService.p.midiToFreq(normalizedNote + (12 * Math.floor(octave)));

    // return (ScaleNotes[scale][step - 1] + Notes[key]) % 12;
  }
}
