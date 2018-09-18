import { Component, Prop } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'adv-ranger-groups',
  styleUrl: 'adv-ranger-groups.scss'
})
export class AdvRangerGroups {
  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  render() {
    return (
      <ion-tabs>
        <adv-group-tab kids></adv-group-tab>
        <adv-group-tab discovery></adv-group-tab>
        <adv-group-tab adventure></adv-group-tab>
        <adv-group-tab expedition></adv-group-tab>
      </ion-tabs>
    );
  }
}