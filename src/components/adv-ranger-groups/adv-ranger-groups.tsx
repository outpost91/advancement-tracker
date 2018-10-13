import { Component, Element, Listen, Prop } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'adv-ranger-groups',
  styleUrl: 'adv-ranger-groups.scss'
})
export class AdvRangerGroups {
  _tabMap = { 'kids': 0,
              'discovery': 1,
              'adventure': 2,
              'expedition': 3
            };
  _tabDefault: boolean;

  @Element() el: HTMLAdvRangerGroupsElement;

  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @Listen('ionTabbarClick')
  async onTabBarClicked(event: CustomEvent<HTMLIonTabElement>) {
    /*
    ** Work around for tabs when not using ion-router
    ** in order for props to be passed.
    */
    const tabs = await this.el.querySelector('ion-tabs');
    await tabs.select(event.detail);
    const tab = await tabs.getSelected();
    if (tab.href !== undefined) {
      this.history.push(tab.href, {});
    }
  }

  componentWillLoad() {
    this._tabDefault = (this.match.params.tab === undefined);
    if (this._tabDefault) {
      this.history.push('/advancement/kids', {});
    }
  }

  async componentDidLoad() {
    const label = this._tabDefault ? 'kids' : this.match.params.tab;
    const tabs = this.el.querySelector('ion-tabs');
    const tab: HTMLIonTabElement = (label !== '') ? this.el.querySelectorAll('ion-tab')[this._tabMap[label]] : this.el.querySelector('ion-tab');

    await tabs.select(tab);
    if (label !== '' && tab && tab.href !== undefined) {
      this.history.push(tab.href, {});
    }
  }

  render() {
    return (
      <ion-tabs useRouter>
        <ion-tab label="Ranger Kids" icon="home" href="/advancement/kids" component="adv-kids-page"></ion-tab>
        <ion-tab label="Discovery" icon="rocket" href="/advancement/discovery" component="adv-discovery-page"></ion-tab>
        <ion-tab label="Adventure" icon="trophy" href="/advancement/adventure" component="adv-adventure-page"></ion-tab>
        <ion-tab label="Expedition" icon="logo-android" href="/advancement/expedition" component="adv-expedition-page"></ion-tab>
      </ion-tabs>
    );
  }
}
