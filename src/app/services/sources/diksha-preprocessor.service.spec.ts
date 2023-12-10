import { TestBed } from '@angular/core/testing';

import { DikshaPreprocessorService } from './diksha-preprocessor.service';

describe('DikshaPreprocessorService', () => {
  let service: DikshaPreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DikshaPreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
