import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/* -------------------------------------------------------------------------- */

@NgModule({
  imports: [RouterOutlet],
  exports: [CommonModule, RouterOutlet],
})
export class AppModule {}
