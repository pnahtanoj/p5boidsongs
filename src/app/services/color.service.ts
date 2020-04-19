import { Injectable } from '@angular/core';
import { PService } from './p.service';

import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public options: p5.Color[][] = [];

  constructor(private pService: PService) {
  }

  initializePalette() {
    this.options = this.getColorPalette();
  }

  getColor(i: number, j: number) {
    return this.options[i][j];
  }

  getPlanetColor() {
    const i = Math.floor(this.pService.p.random(0, this.options.length));
    const j = Math.floor(this.pService.p.random(0, 3));

    return this.options[i][j];
  }

  getFloorColor() {
    const i = Math.floor(this.pService.p.random(0, this.options.length));

    return this.options[i][3];
  }

  migrateColor(source: p5.Color, destination: p5.Color) {
    const ret = this.pService.p.color(source);

    const cRed = this.pService.p.red(source);
    const dRed = this.pService.p.red(destination);
    const cGreen = this.pService.p.green(source);
    const dGreen = this.pService.p.green(destination);
    const cBlue = this.pService.p.blue(source);
    const dBlue = this.pService.p.blue(destination);

    if (cRed < dRed) {
      ret.setRed(cRed + 1);
    } else if (cRed > dRed) {
      ret.setRed(cRed - 1);
    }

    if (cGreen < dGreen) {
      ret.setGreen(cGreen + 1);
    } else if (cGreen > dGreen) {
      ret.setGreen(cGreen - 1);
    }

    if (cBlue < dBlue) {
      ret.setBlue(cBlue + 1);
    } else if (cBlue > dBlue) {
      ret.setBlue(cBlue - 1);
    }

    return ret;
  }

  getColorPalette() {
    const purple = [
      this.pService.p.color(146, 123, 177),
      this.pService.p.color(179, 147, 200),
      this.pService.p.color(177, 146, 199),
      this.pService.p.color(190, 164, 206)
    ];

    const pink = [
      this.pService.p.color(182, 130, 181),
      this.pService.p.color(211, 139, 182),
      this.pService.p.color(223, 148, 188),
      this.pService.p.color(211, 181, 198),
    ];

    const orange = [
      this.pService.p.color(232, 156, 169),
      this.pService.p.color(234, 159, 157),
      this.pService.p.color(238, 169, 148),
      this.pService.p.color(243, 181, 145)
    ];

    const yellow = [
      this.pService.p.color(241, 190, 139),
      this.pService.p.color(246, 206, 138),
      this.pService.p.color(248, 227, 144),
      this.pService.p.color(253, 246, 170),
    ];

    const green = [
      this.pService.p.color(169, 213, 136),
      this.pService.p.color(178, 221, 149),
      this.pService.p.color(194, 225, 174),
      this.pService.p.color(226, 246, 211)
    ];

    const aqua = [
      this.pService.p.color(145, 202, 180),
      this.pService.p.color(170, 211, 196),
      this.pService.p.color(136, 201, 199),
      this.pService.p.color(162, 217, 214)
    ];

    const blue = [
      this.pService.p.color(123, 168, 216),
      this.pService.p.color(154, 186, 220),
      this.pService.p.color(181, 206, 229),
      this.pService.p.color(202, 226, 250)
    ];

    const rose = [
      this.pService.p.color(213, 123, 132),
      this.pService.p.color(218, 151, 157),
      this.pService.p.color(227, 185, 190),
      this.pService.p.color(236, 203, 205)
    ];

    return [
      purple, pink, orange, yellow, green, aqua, blue, rose
    ];
  }
}
