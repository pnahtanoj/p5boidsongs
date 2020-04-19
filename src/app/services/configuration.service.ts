import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration, defaultConfig } from '../model/Configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  config$: BehaviorSubject<Configuration> = new BehaviorSubject({ ...defaultConfig });

  constructor() { }

  updateWindowSize(width: number, height: number) {
    this.config$.next({
      ...this.config$.value,
      windowWidth: width,
      windowHeight: height
    });
  }
}
