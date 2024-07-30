import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { SpeechToTextService } from '@services/speech.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'speech-to-text',
  template: `
    <h5>STT</h5>
    <div class="container">
      <span>Audio Input: {{ stt.audioInputDeviceName }}</span>
      <textarea name="text" [(ngModel)]="text" readonly></textarea>
      <div
        class="btn_container"
        [matTooltip]="stt.hasAudioPermissions ? '' : 'Audio permissions not granted.'"
      >
        <!-- <button
          mat-flat-button
          color="primary"
          (pointerdown)="startRecording()"
          (pointerup)="stopRecording()"
          [disabled]="!stt.hasAudioPermissions"
        >
          {{ stt.isRecording ? 'Recording' : 'Hold to Record' }}
        </button> -->
        <button
          mat-mini-fab
          color="accent"
          [ngClass]="(stt.isRecording$ | async) ? 'recording' : ''"
          (click)="toggleRecord()"
        >
          <mat-icon>mic</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrl: './speech-to-text.component.scss',
})
export class SpeechToTextComponent {
  text: string = '';
  subscription = new Subscription();

  constructor(public stt: SpeechToTextService, private cdr: ChangeDetectorRef) {}
  /* ------------------------------------------------------------------------ */

  ngOnInit() {
    this.subscription.add(
      this.stt.text$.subscribe((value) => {
        this.text = value;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* ------------------------------------------------------------------------ */

  toggleRecord() {
    this.stt.toggleRecord();
  }

  startRecording() {
    this.stt.startRecording();
  }

  stopRecording() {
    this.stt.stopRecording();
  }
}
