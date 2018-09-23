import { Component, Prop, State } from '@stencil/core';


@Component({
  tag: 'tracker-planner-checkbox-item',
  styleUrl: 'tracker-planner-checkbox-item.scss'
})
export class TrackerPlannerCheckboxItem {
  @Prop() id?: string | null;
  @Prop() items: any = [];
  @Prop() label: string;

  @State() _items: any = [];

  componentWillUpdate() {
    console.log(this.items);
    this._items = this.items;    
  }

  render() {
    return ([
      <ion-item>
        <ion-label>{this.label}</ion-label>
      </ion-item>,
      this._items.map(element => <ion-item><ion-label>{element.value}</ion-label><ion-checkbox slot="start" id={element.id} value={element.value} /></ion-item>)
    ])
  }
}
