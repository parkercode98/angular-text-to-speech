import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TextToSpeechService } from '@services/speech.service';
import { Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'text-to-speech',
  template: `
    <h5>TTS</h5>
    <div class="container">
      <span
        ><strong>{{ 'Playing: ' }}</strong
        >{{ tts.isSpeaking$ | async }}</span
      >
      <textarea name="text" [(ngModel)]="msg"></textarea>
      <div class="btn_container">
        <button mat-flat-button color="primary" (click)="tts.pause()">Stop</button>
        <button mat-flat-button color="primary" (click)="tts.speak(this.msg)">Speak</button>
      </div>
    </div>
  `,
  styleUrl: './text-to-speech.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextToSpeechComponent {
  msg = 'The quick brown fox jumps over the lazy dog';
  subscription = new Subscription();
  /* ----------------- */

  constructor(public tts: TextToSpeechService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
