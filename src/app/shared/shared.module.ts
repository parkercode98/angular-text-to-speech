import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialImportModule } from './lib';
import { AiGlobComponent, MicButtonComponent } from './components';
/* -------------------------------------------------------------------------- */

@NgModule({
  declarations: [AiGlobComponent, MicButtonComponent],
  imports: [CommonModule, MaterialImportModule],
  exports: [AiGlobComponent, MicButtonComponent, MaterialImportModule],
})
export class SharedModule {}
