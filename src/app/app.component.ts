import { Component, OnInit, HostListener } from '@angular/core';
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { PService } from './services/p.service';
import { PlanetService } from './services/planet.service';
import { ColorService } from './services/color.service';
import { tap, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './services/configuration.service';


const canvas: p5.Vector = new p5.Vector();
canvas.x = 1600;
canvas.y = 850;

const countSliderLocation: p5.Vector = new p5.Vector();
countSliderLocation.x = canvas.x - 170;
countSliderLocation.y = canvas.y - 50;

const speedSliderLocation: p5.Vector = new p5.Vector();
speedSliderLocation.x = canvas.x - 170;
speedSliderLocation.y = canvas.y - 100;

const topCount = 40;
const startingMoverCount = 10;
const startingSpeed = 20;
const topSpeed = 30;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  resize$: BehaviorSubject<{ width: number, height: number }> =
    new BehaviorSubject({ width: window.innerWidth, height: window.innerHeight });
  p5: any;

  bg: p5.Color;
  bgDestination: p5.Color;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.config.updateWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  constructor(
    private pService: PService,
    private config: ConfigurationService,
    private planets: PlanetService,
    private color: ColorService,
  ) {
  }

  ngOnInit() {
    console.log(window.innerWidth, window.innerHeight);
    this.config.updateWindowSize(window.innerWidth, window.innerHeight);
    this.pService.createCanvas(this.sketch.bind(this));
  }

  private sketch(p: any) {
    p.setup = () => {
      this.color.initializePalette();

      this.bg = this.color.getFloorColor();
      this.bgDestination = this.bg;

      this.planets.collisionOccured$
        .pipe(
          skip(1),
          tap(c => this.bgDestination = this.color.getFloorColor()))
        .subscribe();

      p.createCanvas(canvas.x, canvas.y);

      this.planets.generateNonOverlapping(10, [150, 250], canvas);
      this.planets.setRandomSpeeds(0.2);
      this.planets.initKey();
    };

    p.draw = () => {
      p.background(this.bg);
      this.bg = this.color.migrateColor(this.bg, this.bgDestination);

      this.planets.update();
      this.planets.fadeNotesTowardDestination();
      this.planets.fadeColorsTowardDestination();

      if (p.frameCount % 50 === 0) {
        this.planets.updateFilters();
      }

      this.planets.display();
    };
  }
}
