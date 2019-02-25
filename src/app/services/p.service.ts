import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PService {
  pInstance: any;

  constructor() { }

  set p(p: any) {
    this.pInstance = p;
  }

  get p() {
    return this.pInstance;
  }
}
