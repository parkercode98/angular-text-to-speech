import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'text-to-speech',
  template: `
    <h5>TTS</h5>
    <div class="container">
      <app-speech-voice></app-speech-voice>
      <app-speech-text></app-speech-text>
    </div>
  `,
  styleUrl: './text-to-speech.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextToSpeechComponent {}
