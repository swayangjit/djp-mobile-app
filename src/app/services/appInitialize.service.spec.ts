import { TestBed } from '@angular/core/testing';

import { AppInitializeService } from './appInitialize.service';

describe('ApiService', () => {
  let service: AppInitializeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitializeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
