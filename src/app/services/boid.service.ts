import { Injectable } from '@angular/core';
import { Mover } from '../model/Mover';

@Injectable({
  providedIn: 'root'
})
export class BoidService {
  boids: Mover[] = [];

  constructor() { }
}
