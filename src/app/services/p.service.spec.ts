import { TestBed } from '@angular/core/testing';

import { PService } from './p.service';

describe('PService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PService = TestBed.get(PService);
    expect(service).toBeTruthy();
  });
});
