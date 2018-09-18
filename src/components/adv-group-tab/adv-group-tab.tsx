import { Component, Prop, State } from '@stencil/core';

//export interface IRangerGroups {
//  kids?: boolean | undefined | null;
//  discovery?: boolean | undefined | null;
//  adventure?: boolean | undefined | null;
//  expedition?: boolean | undefined | null;
//}

@Component({
  tag: 'adv-group-tab',
  styleUrl: 'adv-group-tab.scss'
})
export class AdvGroupTab {
  @Prop() kids?: boolean | undefined | null;
  @Prop() discovery?: boolean | undefined | null;
  @Prop() adventure?: boolean | undefined | null;
  @Prop() expedition?: boolean | undefined | null;

  @State() groupStr: string = '';

  componentWillLoad() {
    if(this.kids) {
      this.groupStr = 'Ranger Kids';
    } else if(this.discovery) {
      this.groupStr = 'Discovery Rangers';
    } else if(this.adventure) {
      this.groupStr = 'Adventure Rangers';
    } else if(this.expedition) {
      this.groupStr = 'Expedition Rangers';
    } else {
      this.groupStr = '';
    }
  }

  render() {
    return (
      <ion-tab label={this.groupStr}>
        <ion-header>
          <ion-toolbar>
            <ion-title>{this.groupStr}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content padding>
          <h1>Home Content</h1>
        </ion-content>
      </ion-tab>
    );
  }
}