import { TestBed } from '@angular/core/testing';

import { SunbirdPreprocessorService } from './sunbird-preprocessor.service';

describe('SunbirdPreprocessorService', () => {
  let service: SunbirdPreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SunbirdPreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
