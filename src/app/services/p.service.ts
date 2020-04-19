import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { ConfigurationService } from './configuration.service';
import { tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PService {
  pInstance: any;
  p5: any;

  constructor(private config: ConfigurationService) {
    // better memoized in store i think //
    this.config.config$
      .pipe(
        filter(c => !!this.p5),
        tap(c => this.resizeCanvas(c.windowWidth, c.windowHeight))
      )
      .subscribe();
  }

  set p(p: any) {
    this.pInstance = p;
  }

  get p() {
    return this.pInstance;
  }

  createCanvas(sketch: (p: any) => void) {
    this.p5 = new p5(this.intercept(sketch));
  }

  resizeCanvas(width: number, height: number) {
    console.log('RESIZE: ', width, height);
    this.p5.resizeCanvas(width, height);
  }

  intercept(sketch: (p: any) => void) {
    return (p: any) => {
      this.pInstance = p;
      sketch(p);
    };
  }
}
