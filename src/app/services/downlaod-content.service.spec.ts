import { TestBed } from '@angular/core/testing';

import { DownlaodContentService } from './downlaod-content.service';

describe('DownlaodContentService', () => {
  let service: DownlaodContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownlaodContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
