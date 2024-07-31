import { Component } from '@angular/core';
import { SpeechModule, EventStreamModule } from '@modules/index';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [SpeechModule, SharedModule, EventStreamModule],
  template: `
    <text-to-speech />
    <speech-to-text />
    <event-stream />
  `,
  styleUrl: './test.component.scss',
})
export class TestComponent {}
