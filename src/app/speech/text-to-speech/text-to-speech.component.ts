import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-text-to-speech',
  template: `
    <div class="voiceinator">
      <h1>TTS</h1>
      <app-speech-voice></app-speech-voice>
      <app-speech-text></app-speech-text>
    </div>
  `,
  styleUrl: './text-to-speech.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextToSpeechComponent {}
