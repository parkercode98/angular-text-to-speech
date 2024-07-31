import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
/* -------------------------------------------------------------------------- */

@NgModule({
  declarations: [TextToSpeechComponent, SpeechToTextComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [TextToSpeechComponent, SpeechToTextComponent],
})
export class SpeechModule {}
