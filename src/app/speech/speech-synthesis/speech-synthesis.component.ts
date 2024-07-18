import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-speech-synthesis',
  template: `
    <div class="voiceinator">
      <h1>TTS</h1>
      <app-speech-voice></app-speech-voice>
      <app-speech-text></app-speech-text>
    </div>
  `,
  styleUrl: './speech-synthesis.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechSynthesisComponent {}
