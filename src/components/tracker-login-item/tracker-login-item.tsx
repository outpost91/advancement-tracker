import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login-item',
  styleUrl: 'tracker-login-item.scss'
})
export class TrackerLoginItem {

  @Prop() auth: AuthService;
  @Prop() authorized: boolean;

  @State() _authorized: boolean;

  @Event() authClicked: EventEmitter;

  updateAuthorizedState() {
    this._authorized = this.authorized;
  }

  componentWillLoad() {
    this.updateAuthorizedState();
  }

  componentWillUpdate() {
    this.updateAuthorizedState();
  }

  render() {
    return (
      <ion-item lines="full" onClick={this._authorized
                                        ? (event: UIEvent) => this.authClicked.emit(event)
                                        : null}
                               href={this._authorized
                                        ? null
                                        : '/login'}>
        <ion-avatar slot="start" >
          <img src={(this._authorized && this.auth.isLoggedIn().photoURL) ? this.auth.isLoggedIn().photoURL : './build/app/svg/md-contact.svg'} />
        </ion-avatar>
        <ion-label>
          {this._authorized
            ? 'Sign Out'
            : 'Sign In'
          }
        </ion-label>
      </ion-item>
    );
  }
}
