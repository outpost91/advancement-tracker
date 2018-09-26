import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'tracker-planner-date-item',
  styleUrl: 'tracker-planner-date-item.scss'
})
export class TrackerPlannerDateItem {
  _label: string;
  _today: string = new Date().toISOString();

  @Prop() label?: string;

  componentWillLoad() {
    this._label = (this.label !== undefined) ? this.label : 'Ranger Meeting Date';
  }

  render() {
    return (
      <ion-item>
        <ion-label position="floating">{this._label}</ion-label>
        <ion-datetime display-format="DDDD MMMM D YYYY" picker-format="MMMM D YYYY" value={this._today}></ion-datetime>
      </ion-item>
    );
  }
}
