import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpeechToTextService, TextToSpeechService } from '@services/speech.service';
import { AiGlob } from '@shared/components';
import { SharedModule } from '@shared/shared.module';
import { BehaviorSubject, Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [SharedModule, CommonModule],
  template: `
    <button mat-flat-button color="primary" (click)="speak()">Speak</button>
    <ai-glob [size]="500" [state]="(globState$ | async) || 'idle'" (pointerdown)="handleGlobPointerDown()" />

    <p>{{ text$ | async }}</p>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private subscription = new Subscription();
  globState$ = new BehaviorSubject<AiGlob.State>('idle');
  text$ = new BehaviorSubject<string>('');

  constructor(private tts: TextToSpeechService, public stt: SpeechToTextService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.tts.isSpeaking$.subscribe((value) => {
        this.globState$.next(!!value ? 'speaking' : 'idle');
      })
    );

    this.subscription.add(
      this.stt.isRecording$.subscribe((value) => {
        this.globState$.next(!!value ? 'listening' : 'idle');
      })
    );
  }

  speak() {
    this.tts.speak('The quick brown fox jumps over the lazy dog');
  }

  handleGlobPointerDown() {
    window.addEventListener('pointerup', this.stt.stopRecording.bind(this.stt), { once: true });
    this.stt.startRecording().then((value) => {
      if (!!value) {
        this.text$.next(value);
        setTimeout(() => this.text$.next(''), 5000);
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
