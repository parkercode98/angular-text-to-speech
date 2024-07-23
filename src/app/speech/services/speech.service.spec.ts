import { TestBed } from '@angular/core/testing';

import { TextToSpeechService } from './speech.service';

describe('SpeechServiceService', () => {
  let service: TextToSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextToSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
