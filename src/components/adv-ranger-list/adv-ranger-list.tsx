import { Component, Prop } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'adv-ranger-list',
  styleUrl: 'adv-ranger-list.scss'
})
export class AdvRangerList {
  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  render() {
    return (
      <ion-list>
        <ion-item>
          <ion-avatar item-start>
            <img src= "./build/app/svg/md-contact.svg" />
          </ion-avatar>
          <h2>Adam Jr. Wieseler</h2>
          <p>Ranger Kids</p>
        </ion-item>
      </ion-list>
    );
  }
}