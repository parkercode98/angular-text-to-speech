import { Component } from '@angular/core';
import { SpeechToTextService } from '../services/speech.service';

@Component({
  selector: 'app-speech-to-text',
  template: `
    <div class="voiceinator">
      <h1>STT</h1>
      <textarea name="text" [(ngModel)]="text"></textarea>

      <button id="stop" #stop (click)="stopRecording()">Stop</button>
      <button id="record" #record (click)="startRecording()">Record</button>
    </div>
  `,
  styleUrl: './speech-to-text.component.scss',
})
export class SpeechToTextComponent {
  text: string = '';
  /* ----------------- */
  constructor(private speechToTextService: SpeechToTextService) {}
  /* ----------------- */

  startRecording() {
    this.speechToTextService.startRecording();
  }

  stopRecording() {
    this.speechToTextService.stopRecording();
  }
}
