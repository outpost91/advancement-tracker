import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login-item',
  styleUrl: 'tracker-login-item.scss'
})
export class TrackerLoginItem {

  @Prop() auth: AuthService;

  @State() authorized = false;

  @Event() authClicked: EventEmitter;

  componentWillLoad() {
    this.auth.onAuthChanged(data => {
      this.authorized = (data != null);
    });
  }

  render() {
    return (
        // tslint:disable-next-line:no-multi-spaces
        <ion-item lines="full" onClick={this.authorized
                                        ? (event: UIEvent) => this.authClicked.emit(event)
                                        : null}
                               href={this.authorized
                                        ? null
                                        : '/login'}>
        <ion-avatar slot="start" >
          <img src={(this.authorized && this.auth.isLoggedIn().photoURL) ? this.auth.isLoggedIn().photoURL : './build/app/svg/md-contact.svg'} />
        </ion-avatar>
        <ion-label>
          {this.authorized
            ? 'Sign Out'
            : 'Sign In'
          }
        </ion-label>
      </ion-item>
    );
  }
}
