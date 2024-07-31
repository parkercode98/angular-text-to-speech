import { Routes } from '@angular/router';
import { HomeComponent, TestComponent } from '@pages';
/* -------------------------------------------------------------------------- */

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // redirectTo: 'test',
    // pathMatch: 'full',
    title: 'TTS & STT',
  },
  {
    path: 'test',
    component: TestComponent,
    title: 'Test',
  },
];
