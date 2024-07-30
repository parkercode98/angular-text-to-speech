import { Component } from '@angular/core';
import { AppModule } from './app.module';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppModule],
  template: `
    <div class="main-wrapper">
      <text-to-speech />
      <speech-to-text />
      <event-stream />
      <!-- <ai-glob></ai-glob> -->
      <!-- <mic-button></mic-button> -->
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tts_stt';
}
