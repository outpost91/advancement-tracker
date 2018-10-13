import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'tracker-planner-select-item',
  styleUrl: 'tracker-planner-select-item.scss'
})
export class TrackerPlannerSelectItem {
  @Element() el: HTMLTrackerPlannerSelectItemElement;

  @Prop() id: string;
  @Prop() items: { key: string,
                   value: string
                 }[];
  @Prop() label: string;

  @State() _items: { key: string,
                     value: string
                   }[];

  @Event() trackerSelectChange: EventEmitter;

  @Listen('ionChange')
  onIonChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.trackerSelectChange.emit({ ...event.detail, id: this.id });
  }

  componentWillUpdate() {
    // Trying to clean up
    this._items = (this.items && this.items.length > 0) ? this.items : undefined;

    (this.el.querySelector('ion-select#' + this.id) as HTMLIonSelectElement).interfaceOptions = {
                                                                                                  header: this.label,
                                                                                                  subHeader: 'Select the lesson for this plan'
                                                                                                };
  }

  componentDidUpdate() {
    (this.el.querySelector('ion-select') as HTMLIonSelectElement).disabled = !(this._items && this._items.length > 0);
  }

  render() {
    return (
      <ion-item>
        <ion-label>{this.label}</ion-label>
        <ion-select name={this.id ? this.id : null} id={this.id ? this.id : null} interface="action-sheet" placeholder="Select One">
          { this._items
            ? this._items.map(element => <ion-select-option value={element.key}>{element.value}</ion-select-option>)
            : null
          }
        </ion-select>
      </ion-item>
    );
  }
}
