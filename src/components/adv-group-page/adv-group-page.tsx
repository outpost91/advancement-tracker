import { Component, Prop, State } from '@stencil/core';


@Component({
  tag: 'adv-group-page',
  styleUrl: 'adv-group-page.scss'
})
export class AdvGroupPage {
  _cnt: number;
  _title: string;

  @Prop() kids?: boolean | undefined | null;
  @Prop() discovery?: boolean | undefined | null;
  @Prop() adventure?: boolean | undefined | null;
  @Prop() expedition?: boolean | undefined | null;
  @Prop() tabTitle = '';

  @State() groupStr = '';

  componentWillLoad() {
    // If 'label' provided do not use default label
    this.groupStr = this.buildDefaultGroupStr();

    this._title = this.tabTitle;
    // default title is 'this.groupStr'
    if (this._title === '') {
      this._title = this.groupStr;
    }
  }

  buildDefaultGroupStr(): string {
    this._cnt = 0;
    this._cnt += this.kids ? 1 : 0;
    this._cnt += this.discovery ? 1 : 0;
    this._cnt += this.adventure ? 1 : 0;
    this._cnt += this.expedition ? 1 : 0;

    if (this._cnt > 1) {
      throw new Error('only one can be defined in <adv-group-tab />: kids(default) discovery adventure expedition');
    }

    // Ranger Kids is default tag
    if (!this.kids && !this.discovery && !this.adventure && !this.expedition) {
      this.kids = true;
    }

    // return default string
    if (this.kids) {
      return 'Ranger Kids';
    } else if (this.discovery) {
      return 'Discovery Rangers';
    } else if (this.adventure) {
      return 'Adventure Rangers';
    } else if (this.expedition) {
      return 'Expedition Rangers';
    }
  }

  render() {
    return (
      <ion-page>
        The {this.groupStr} page is still Under Construction. Check back.
      </ion-page>
    );
  }
}
