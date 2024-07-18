import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, fromEvent, map, merge, tap } from 'rxjs';
import { SpeechService } from '../services/speech.service';
import { VoiceService } from '../services/voice.service';

@Component({
  selector: 'app-speech-text',
  template: `
    <ng-container>
      <textarea name="text" [(ngModel)]="msg" (change)="textChanged$.next()"></textarea>
      <button id="stop" #stop>Stop!</button>
      <button id="speak" #speak>Speak</button>
      <button class="primary" type="button" id="eleven" #eleven (click)="playTextToSpeech()">Eleven Labs TTS</button>
    </ng-container>
  `,
  styleUrl: './speech-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechTextComponent implements OnInit, OnDestroy {
  @ViewChild('stop', { static: true, read: ElementRef })
  btnStop!: ElementRef<HTMLButtonElement>;

  @ViewChild('speak', { static: true, read: ElementRef })
  btnSpeak!: ElementRef<HTMLButtonElement>;

  textChanged$ = new Subject<void>();
  subscription = new Subscription();
  msg = 'The quick brown fox jumps over the lazy dog';

  constructor(private speechService: SpeechService, private elevenVoice: VoiceService) {}

  /* ----------------- */

  playTextToSpeech() {
    this.elevenVoice.playTextToSpeech(this.msg);
  }

  /* ----------------- */

  ngOnInit(): void {
    this.speechService.updateSpeech({ name: 'text', value: this.msg });

    const btnStop$ = fromEvent(this.btnStop.nativeElement, 'click').pipe(map(() => false));
    const btnSpeak$ = fromEvent(this.btnSpeak.nativeElement, 'click').pipe(map(() => true));

    this.subscription.add(
      merge(btnStop$, btnSpeak$)
        .pipe(tap(() => this.speechService.updateSpeech({ name: 'text', value: this.msg })))
        .subscribe((startOver) => this.speechService.toggle(startOver))
    );

    this.subscription.add(
      this.textChanged$
        .pipe(tap(() => this.speechService.updateSpeech({ name: 'text', value: this.msg, shouldToggle: false })))
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
