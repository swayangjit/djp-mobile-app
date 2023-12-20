import { TestBed } from '@angular/core/testing';

import { BotApiService } from './bot-api.service';

describe('BotApiService', () => {
  let service: BotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
