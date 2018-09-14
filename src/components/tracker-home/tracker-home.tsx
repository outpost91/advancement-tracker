import { Component, Prop } from '@stencil/core';
import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-home',
  styleUrl: 'tracker-home.scss'
})
export class TrackerHome {
  @Prop() auth: AuthService;

  componentDidLoad() {
   // ON LOAD
  }

  render() {
    return (
      <ion-page>
        Hello World!
      </ion-page>
    );
  }
}
