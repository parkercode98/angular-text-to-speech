import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable, Subject } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Injectable({ providedIn: 'root' })
export class EventMqttService {
  private endpoint: string;
  log$ = new Subject<string>();

  constructor(private _mqttService: MqttService) {
    this.endpoint = 'events';
    this.init();
  }

  private init() {
    this._mqttService.onConnect.subscribe(() => {
      this.log$.next('Connected to MQTT');
    });

    this._mqttService.onError.subscribe((error) => {
      this.log$.next(`Error: ${JSON.stringify(error)}`);
      this._mqttService.disconnect();
    });

    this._mqttService.onClose.subscribe(() => {
      this.log$.next('Disconnected from MQTT');
    });

    this._mqttService.onMessage.subscribe((msg) => {
      this.log$.next(`Message: ${JSON.stringify(msg)}`);
    });

    this._mqttService.messages.subscribe((msg) => {
      this.log$.next(`Message: ${JSON.stringify(msg)}`);
    });
  }

  topic(deviceId: string): Observable<IMqttMessage> {
    let topicName = `/${this.endpoint}/${deviceId}`;
    return this._mqttService.observe(topicName);
  }
}
