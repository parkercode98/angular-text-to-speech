import { Component } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="glob-container">
      <ai-glob />
    </div>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
