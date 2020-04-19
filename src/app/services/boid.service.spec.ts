import { TestBed } from '@angular/core/testing';

import { BoidService } from './boid.service';

describe('BoidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoidService = TestBed.get(BoidService);
    expect(service).toBeTruthy();
  });
});
