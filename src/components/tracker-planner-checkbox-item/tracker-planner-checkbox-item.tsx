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

  refreshItems() {
    this._items = this.items;
  }
  componentWillLoad() {
    this.refreshItems();
  }
  componentWillUpdate() {
    this.refreshItems();
  }

  render() {
    return ([
      <ion-item>
        <ion-label>{this.label}</ion-label>
      </ion-item>,
      this._items.map(element => <ion-item>
                                   {(element.img && element.img !== '')
                                    ? <ion-avatar><img src={element.img} /></ion-avatar>
                                    : null }
                                   <ion-label>{element.value}</ion-label>
                                   <ion-checkbox slot="start" name={`${this.id}-${element.id}`} value={element.value} />
                                 </ion-item>)
    ]);
  }
}
