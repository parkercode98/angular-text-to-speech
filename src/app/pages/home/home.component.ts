import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { TextToSpeechService } from '@services/speech.service';
import { SharedModule } from '@shared/shared.module';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [SharedModule, CommonModule],
  template: `
    <span></span>
    <ai-glob [size]="500" [scale]="(scale$ | async) ?? 1" />

    <button mat-flat-button color="primary" (click)="speak()">Speak</button>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private subscription = new Subscription();
  scale$ = new BehaviorSubject(1);
  private scaleInterval: NodeJS.Timeout;

  constructor(private tts: TextToSpeechService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.tts.isPlaying$.subscribe((value) => {
        if (value) {
          this.scaleInterval = setInterval(() => {
            // between 0.5 and 1.8
            // const dec = Math.random() * (1.8 - 0.5) + 0.5;

            // between 0.8 and 1.2
            const dec = Math.random() * (1.2 - 0.8) + 0.8;
            this.scale$.next(dec);
          }, 150);
        } else {
          clearInterval(this.scaleInterval);
          this.scale$.next(1);
        }
      })
    );
  }

  speak() {
    this.tts.speak('The quick brown fox jumps over the lazy dog');
  }
}
