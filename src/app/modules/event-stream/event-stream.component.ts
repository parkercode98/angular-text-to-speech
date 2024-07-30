import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventMqttService } from '@services/event.mqtt.service';
import { Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'event-stream',
  template: `
    <h5>Event Stream</h5>
    <div class="container">
      <textarea name="log" [value]="log.join('\\n')" readonly></textarea>
    </div>
  `,
  styleUrl: './event-stream.component.scss',
})
export class EventStreamComponent implements OnInit, OnDestroy {
  log: string[] = [];
  events: any[] = [];
  subscription: Subscription = new Subscription();

  constructor(private readonly eventMqtt: EventMqttService) {}

  ngOnInit() {
    this.eventMqtt.log$.subscribe((data) => {
      this.log.push(data);
    });
    this.subscribeToTopic();
  }

  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
  }

  /* ------------------------------------------------------------------------ */
  private subscribeToTopic() {
    // this.subscription = this.eventMqtt.topic(this.deviceId).subscribe((data: IMqttMessage) => {
    //   let item = JSON.parse(data.payload.toString());
    //   this.events.push(item);
    //   console.log('EVENTS: ', this.events);
    // });
  }
}
