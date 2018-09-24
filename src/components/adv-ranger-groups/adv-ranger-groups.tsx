import { Component, Element, Listen, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'adv-ranger-groups',
  styleUrl: 'adv-ranger-groups.scss'
})
export class AdvRangerGroups {
  _cnt: number;
  _title: string;

  @Element() el: HTMLAdvRangerGroupsElement;

  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;
  @Prop() history: RouterHistory;

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

  async componentDidLoad() {
    const tabs = this.el.querySelector('ion-tabs');
    const tab = tabs.querySelector('ion-tab');
    await tabs.select(tab);
    if (tab.href !== undefined) {
      this.history.push(tab.href, {});
    }
  }

  render() {
    return (
      <ion-tabs useRouter>
        <ion-tab label="Ranger Kids" icon="home" href="/advancement/kids"></ion-tab>
        <ion-tab label="Discovery" icon="rocket" href="/advancement/discovery"></ion-tab>
        <ion-tab label="Adventure" icon="trophy" href="/advancement/adventure"></ion-tab>
        <ion-tab label="Expedition" icon="logo-android" href="/advancement/expedition"></ion-tab>
      </ion-tabs>
    );
  }
}
