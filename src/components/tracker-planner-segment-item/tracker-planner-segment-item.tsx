import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';


@Component({
  tag: 'tracker-planner-segment-item',
  styleUrl: 'tracker-planner-segment-item.scss'
})
export class TrackerPlannerSegmentItem {
  @Prop() id: string;
  @Prop() items: any = [];

  @Event() trackerSegmentChange: EventEmitter;

  @Listen('ionChange')
  onIonChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.trackerSegmentChange.emit(event.detail);
  }

  render() {
    return (
      <ion-item>
        <ion-segment>
          <ion-segment-button value="Ranger Kids">
            Ranger Kids
          </ion-segment-button>
          <ion-segment-button value="Discovery Rangers">
            Discovery
          </ion-segment-button>
          <ion-segment-button value="Adventure Rangers">
            Adventure
          </ion-segment-button>
          <ion-segment-button value="Expedition Rangers">
            Expedition
          </ion-segment-button>
        </ion-segment>
      </ion-item>
    );
  }
}