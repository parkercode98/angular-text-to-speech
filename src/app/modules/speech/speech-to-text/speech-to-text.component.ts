import { ChangeDetectorRef, Component } from '@angular/core';
import { SpeechToTextService } from '@services/speech.service';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'speech-to-text',
  template: `
    <h5>STT</h5>
    <div class="container">
      <span
        ><strong>{{ 'Audio Input: ' }}</strong
        >{{ stt.audioInputDeviceName }}</span
      >
      <span
        ><strong>{{ 'Status: ' }}</strong
        >{{ stt.status$ | async }}</span
      >
      <textarea name="text" [value]="stt.text$ | async" readonly></textarea>
      <div
        class="btn_container"
        [matTooltip]="stt.hasAudioPermissions ? '' : 'Audio permissions not granted.'"
      >
        <button
          mat-flat-button
          color="primary"
          [ngClass]="(stt.isRecording$ | async) ? 'recording' : ''"
          (pointerdown)="handleRecordBtnDown()"
          [disabled]="!stt.hasAudioPermissions"
        >
          <mat-icon>mic</mat-icon>
          {{ (stt.isRecording$ | async) ? 'Recording' : 'Hold to Record' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './speech-to-text.component.scss',
})
export class SpeechToTextComponent {
  text: string = '';

  constructor(public stt: SpeechToTextService, private cdr: ChangeDetectorRef) {}
  /* ------------------------------------------------------------------------ */

  ngOnInit() {}

  ngOnDestroy() {}

  /* ------------------------------------------------------------------------ */

  handleRecordBtnDown() {
    this.stt.startRecording();
    window.addEventListener('pointerup', this.stt.stopRecording.bind(this.stt), { once: true });
  }
}
