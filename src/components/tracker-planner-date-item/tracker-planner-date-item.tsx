import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'tracker-planner-date-item',
  styleUrl: 'tracker-planner-date-item.scss'
})
export class TrackerPlannerDateItem {
  _today: String = new Date().toISOString();

  @Prop() id: string;
  @Prop() label: string;

  render() {
    return (
      <ion-item>
        <ion-label position="floating">Ranger Meeting Date</ion-label>
        <ion-datetime display-format="DDDD MMMM D YYYY" picker-format="MMMM D YYYY" value={this._today}></ion-datetime>
      </ion-item>
    );
  }
}