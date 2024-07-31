import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventMqttService } from '@services/event.mqtt.service';
import { TextToSpeechService } from '@services/speech.service';
import { Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'event-stream',
  template: `
    <h5>Event Stream</h5>
    <div class="container">
      <textarea name="log" [value]="(mqtt.log$ | async)?.join('\\n\\n')" readonly></textarea>
      <textarea name="pub" [(ngModel)]="pubValue"></textarea>
      <button mat-flat-button color="primary" (click)="publishMessage()">Send</button>
    </div>
  `,
  styleUrl: './event-stream.component.scss',
})
export class EventStreamComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  pubValue = '';

  constructor(public mqtt: EventMqttService, private tts: TextToSpeechService) {}

  ngOnInit() {
    this.subscribeToMqtt();
  }

  ngOnDestroy() {
    if (!this.subscription.closed) this.subscription.unsubscribe();
  }

  /* ------------------------------------------------------------------------ */
  publishMessage() {
    const value = this.pubValue.trim();
    this.pubValue = '';
    if (!value) return;

    this.mqtt.publishMessage({
      topic: 'test',
      payload: value,
    });
  }

  private subscribeToMqtt() {
    this.subscription.add(
      this.mqtt.mainTopic.subscribe((message) => {
        console.log('MAIN TOPIC: ', message);
      })
    );

    this.subscription.add(
      this.mqtt.topic('ai').subscribe((message) => {
        if (typeof message === 'string') {
          this.tts.speak(message);
        }
      })
    );

    this.subscription.add(this.mqtt.topic('test').subscribe());
  }
}
