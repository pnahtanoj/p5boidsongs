export type scale = 'major' | 'minor' | 'pentatonic' | 'chromatic';

export class Quantizer {
  // returns 0 - 12 based on scale
  getClosestSemitone(preQuantSteps: number, scale: number[]): number {
    const preQuantOctave = Math.abs(preQuantSteps % 12);
    let delta = 13;
    let selection = 0;

    return scale.reduce((acc, current) => {
      const diff = (Math.abs(preQuantOctave - current));

      if (diff < delta) {
        delta = diff;
        selection = current;
      }

      return (diff < delta) ? current : selection;
    }, 0)
  }
}
