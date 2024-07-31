import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
/* -------------------------------------------------------------------------- */
export interface Publish {
  topic: string;
  payload: string;
}

@Injectable({ providedIn: 'root' })
export class EventMqttService {
  private endpoint: string;
  public log$ = useLog();

  constructor(private _mqttService: MqttService) {
    this.endpoint = 'connection';
    this.init();
  }

  private init() {
    this._mqttService.onConnect.subscribe(() => {
      this.log$.push('Connected to MQTT');
    });

    this._mqttService.onError.subscribe((error) => {
      this.log$.push(`[Error]:\n${JSON.stringify(error, null, 2)}`);
      this._mqttService.disconnect();
    });

    this._mqttService.onClose.subscribe(() => {
      this.log$.push('Disconnected from MQTT');
    });

    this._mqttService.messages.subscribe((msg) => {
      const topic = msg.topic;
      const payload = msg.payload.toString();
      this.log$.push(`["${topic}"]: ${payload}`);
    });
  }

  get mainTopic() {
    return this._mqttService.observe(this.endpoint).pipe(transformPayload());
  }

  topic(topicID: string) {
    let topicName = `${this.endpoint}/${topicID}`;
    return this._mqttService.observe(topicName).pipe(transformPayload());
  }

  publishMessage(publish: Publish) {
    console.log('Message published', publish);
    let topicName = `${this.endpoint}/${publish.topic}`;
    this._mqttService.unsafePublish(topicName, publish.payload, 0);
  }
}

function transformPayload() {
  return map<IMqttMessage, Record<string, any> | string>((message) => {
    const payload = message.payload.toString();
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  });
}

function useLog() {
  const log$ = new BehaviorSubject<string[]>([]);

  function push(message: string) {
    log$.next([...log$.value, message]);
  }

  return Object.assign(log$, { push });
}
