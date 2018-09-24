import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';


@Component({
  tag: 'tracker-planner-select-item',
  styleUrl: 'tracker-planner-select-item.scss'
})
export class TrackerPlannerSelectItem {
  @Prop() id: string;
  @Prop() items: any = [];
  @Prop() label: string;
  
  @State() _items: any = [];

  @Event() trackerSelectChange: EventEmitter;

  @Listen('ionChange')
  onIonChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    this.trackerSelectChange.emit({...event.detail, id: this.id});
  }

  componentWillUpdate() {
    this._items = this.items;
  }

  render() {
    return (
      <ion-item>
        <ion-label>{this.label}</ion-label>
        <ion-select id={this.id ? this.id : null} interface="action-sheet" placeholder="Select One">
          {this._items.map(element => <ion-select-option value={element.key}>{element.value}</ion-select-option>)}
        </ion-select>
      </ion-item>
    );
  }
}