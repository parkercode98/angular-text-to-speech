import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpeechModule } from './speech';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpeechModule],
  template: ` <app-speech-synthesis></app-speech-synthesis> `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'text-to-speech';
}
