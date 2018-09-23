import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'tracker-planner-date-item',
  styleUrl: 'tracker-planner-date-item.scss'
})
export class TrackerPlannerDateItem {
  @Prop() id: string;
  @Prop() label: string;

  render() {
    return (
      <ion-item>
        <ion-label position="floating">Ranger Meeting</ion-label>
        <ion-datetime display-format="DDDD MMMM D YYYY" picker-format="MMMM D YYYY"></ion-datetime>
      </ion-item>
    );
  }
}