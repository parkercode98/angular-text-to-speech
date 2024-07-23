import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpeechModule } from './speech';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpeechModule],
  template: `
    <div class="main-wrapper">
      <app-text-to-speech></app-text-to-speech>
      <app-speech-to-text></app-speech-to-text>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'text-to-speech';
}
