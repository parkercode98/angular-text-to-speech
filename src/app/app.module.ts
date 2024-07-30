import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '@shared';
import { EventStreamModule, SpeechModule } from '@modules';
/* -------------------------------------------------------------------------- */

@NgModule({
  imports: [RouterOutlet],
  exports: [CommonModule, RouterOutlet, SpeechModule, SharedModule, EventStreamModule],
})
export class AppModule {}
