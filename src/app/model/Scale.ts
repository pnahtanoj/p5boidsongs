export type Scale = 'pentatonic' | 'minor' | 'major' | 'chromatic';

export const ScaleNotes = {
  'pentatonic': [0, 2, 4, 7, 9],
  'minor': [0, 2, 3, 5, 7, 8, 10],
  'major': [0, 2, 4, 5, 7, 9, 11],
  'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}
