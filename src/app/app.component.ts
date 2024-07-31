import { Component } from '@angular/core';
import { AppModule } from './app.module';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppModule],
  template: `
    <div class="main-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
