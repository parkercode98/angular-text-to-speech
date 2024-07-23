import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, fromEvent, map, merge, tap } from 'rxjs';
import { TextToSpeechService, TTSPropertyName } from '../services/speech.service';

@Component({
  selector: 'app-speech-voice',
  template: `
    <ng-container>
      <label for="rate">Rate:</label>
      <input name="rate" type="range" min="0" max="3" value="1" step="0.1" #rate />
      <label for="pitch">Pitch:</label>
      <input name="pitch" type="range" min="0" max="2" step="0.1" #pitch value="1" />
      <label for="volume">Volume:</label>
      <input name="volume" type="range" min="0" max="1" step="0.1" #volume value="1" />
    </ng-container>
  `,
  styleUrl: './speech-voice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechVoiceComponent implements OnInit, OnDestroy {
  @ViewChild('rate', { static: true, read: ElementRef })
  rate!: ElementRef<HTMLInputElement>;

  @ViewChild('pitch', { static: true, read: ElementRef })
  pitch!: ElementRef<HTMLInputElement>;

  @ViewChild('volume', { static: true, read: ElementRef })
  volume!: ElementRef<HTMLInputElement>;

  subscription = new Subscription();

  constructor(private speechService: TextToSpeechService) {}

  ngOnInit(): void {
    this.subscription.add(
      merge(fromEvent(this.rate.nativeElement, 'change'), fromEvent(this.pitch.nativeElement, 'change'))
        .pipe(
          map((e) => e.target as HTMLInputElement),
          map((e) => ({ name: e.name as TTSPropertyName, value: e.value })),
          tap((property) => this.speechService.updateSpeech(property))
        )
        .subscribe()
    );

    this.subscription.add(
      fromEvent(this.volume.nativeElement, 'change')
        .pipe(
          map((e) => e.target as HTMLInputElement),
          map((e) => e.value),
          tap((volume) => {
            localStorage.setItem('volume', volume ?? '1');
            window.postMessage({ type: 'volumeChange', volume });
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
