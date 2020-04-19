export interface Configuration {
  windowWidth: number;
  windowHeight: number;
  planetCount: number;
  planetSizeRange: number[];
  volume: number;
}

export const defaultConfig: Configuration = {
  windowWidth: 0,
  windowHeight: 0,
  planetCount: 10,
  planetSizeRange: [150, 250],
  volume: 50 // 0 - 100
};
