import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextToSpeechService } from '@services/speech.service';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'text-to-speech',
  template: `
    <h5>TTS</h5>
    <div class="container">
      <textarea name="text" [(ngModel)]="msg"></textarea>
      <div class="btn_container">
        <button mat-flat-button color="primary" (click)="tts.audio.pause()">Stop</button>
        <button mat-flat-button color="primary" (click)="tts.playTextToSpeech(this.msg)">Speak</button>
      </div>
    </div>
  `,
  styleUrl: './text-to-speech.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextToSpeechComponent {
  msg = 'The quick brown fox jumps over the lazy dog';
  /* ----------------- */

  constructor(public tts: TextToSpeechService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
