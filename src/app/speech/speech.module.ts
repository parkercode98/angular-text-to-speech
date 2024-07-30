import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SpeechVoiceComponent } from './speech-voice/speech-voice.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [SpeechVoiceComponent, SpeechTextComponent, TextToSpeechComponent, SpeechToTextComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [TextToSpeechComponent, SpeechToTextComponent],
})
export class SpeechModule {}
