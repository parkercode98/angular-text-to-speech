import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TextToSpeechService } from '@services/speech.service';

@Component({
  selector: 'app-speech-text',
  template: `
    <ng-container>
      <textarea name="text" [(ngModel)]="msg" (change)="textChanged$.next()"></textarea>
      <div class="btn_container">
        <button mat-flat-button color="primary" id="stop" #stop (click)="stopTextToSpeech()">Stop</button>
        <button mat-flat-button color="primary" id="speak" #speak (click)="playTextToSpeech()">Speak</button>
      </div>
    </ng-container>
  `,
  styleUrl: './speech-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechTextComponent implements OnInit, OnDestroy {
  textChanged$ = new Subject<void>();
  subscription = new Subscription();
  msg = 'The quick brown fox jumps over the lazy dog';
  /* ----------------- */

  constructor(private speechService: TextToSpeechService) {}

  playTextToSpeech() {
    this.speechService.playTextToSpeech(this.msg);
  }

  stopTextToSpeech() {
    this.speechService.audio.pause();
  }

  /* ----------------- */
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
