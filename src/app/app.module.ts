import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SpeechModule } from './speech';
import { EventStreamComponent } from './event-stream/event-stream.component';
/* -------------------------------------------------------------------------- */

@NgModule({
  declarations: [],
  imports: [RouterOutlet, EventStreamComponent],
  exports: [CommonModule, RouterOutlet, SpeechModule, SharedModule, EventStreamComponent],
})
export class AppModule {}
