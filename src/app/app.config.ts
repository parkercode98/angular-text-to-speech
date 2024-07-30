import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MqttModule } from 'ngx-mqtt';
import { routes } from './app.routes';
import { environment as env } from '@env/environment.secret';
/* -------------------------------------------------------------------------- */

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    importProvidersFrom(
      MqttModule.forRoot({
        hostname: env.mqtt.hostname,
        port: env.mqtt.port,
        protocol: env.mqtt.protocol,
      })
    ),
  ],
};
