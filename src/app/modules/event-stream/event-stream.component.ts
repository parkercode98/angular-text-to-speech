import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { EventMqttService } from '@services/event.mqtt.service';
import { Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'event-stream',
  template: `
    <h5>Event Stream</h5>
    <div class="container">
      <textarea name="log" [value]="log.join('\\n')" readonly></textarea>
      <div class="btn_container">
        <button mat-flat-button color="primary" (click)="init()" [disabled]="didInit">Init</button>
      </div>
    </div>
  `,
  styleUrl: './event-stream.component.scss',
})
export class EventStreamComponent implements OnInit, OnDestroy {
  log: string[] = [];
  events: any[] = [];
  subscription: Subscription = new Subscription();
  didInit = false;

  constructor(private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
  }

  /* ------------------------------------------------------------------------ */
  init() {
    this.didInit = true;
    const eventMqtt = this.injector.get(EventMqttService);
    eventMqtt.log$.subscribe((data) => {
      this.log.push(data);
    });
    this.subscribeToTopic();
    this.cdr.detectChanges();
  }

  private subscribeToTopic() {
    // this.subscription = this.eventMqtt.topic(this.deviceId).subscribe((data: IMqttMessage) => {
    //   let item = JSON.parse(data.payload.toString());
    //   this.events.push(item);
    //   console.log('EVENTS: ', this.events);
    // });
  }
}
