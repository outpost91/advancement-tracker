import '@ionic/core';

import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login-item',
  styleUrl: 'tracker-login-item.scss'
})
export class TrackerLoginItem {
  
  @Prop() authorized: boolean;
  @Prop() Auth: AuthService;

  @Event() authClicked: EventEmitter;

  render() {
    return (
        <ion-item lines='full'  onClick={this.authorized
                                          ? (event: UIEvent) => this.authClicked.emit(event)
                                          : null}
                                href={this.authorized
                                        ? null 
                                        : "/login"}>
        <ion-avatar slot="start" >
          <img src={(this.authorized && this.Auth.isLoggedIn().photoURL) ? this.Auth.isLoggedIn().photoURL : "./build/app/svg/md-contact.svg"} />
        </ion-avatar>
        <ion-label>
          {this.authorized
            ? "Sign Out"
            : "Sign In"
          }
        </ion-label>
      </ion-item>
    );
  }
}