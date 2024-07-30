import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { EventStreamComponent } from './event-stream.component';
/* -------------------------------------------------------------------------- */

@NgModule({
  declarations: [EventStreamComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [EventStreamComponent],
})
export class EventStreamModule {}
