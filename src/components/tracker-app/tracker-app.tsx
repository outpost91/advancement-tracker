import '@ionic/core';

import { Component, Element, Listen, Prop, State } from '@stencil/core';
import '@stencil/router';

import { AuthService } from '../../services/auth';
import { ConfigService } from '../../services/config';
import { DatabaseService } from '../../services/database';

@Component({
  tag: 'tracker-app',
  styleUrl: 'tracker-app.scss'
})
export class TrackerApp {

  Auth: AuthService;
  Config: ConfigService;
  Database: DatabaseService;
  _msg: string;

  @Element() el: HTMLTrackerAppElement;

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  @State() defaultProps: {
    auth?: AuthService,
    db?: DatabaseService
  };
  @State() authorized = false;

  async showToast(isSignedIn: boolean, position: 'top' | 'bottom' | 'middle' = 'bottom') {
    this._msg = 'Signed Out!';
    if (isSignedIn) {
      this._msg = 'Welcome Back';
    }

    if (this.Auth.isLoggedIn().displayName !== '') {
      this._msg = this._msg.concat(', ', this.Auth.isLoggedIn().displayName);
    }

    const toast = await this.toastCtrl.create({
      message: this._msg,
      duration: 2000,
      position
    });

    toast.present();
  }

  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast: any = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });
    await toast.present();
    await toast.onWillDismiss();
    window.location.reload();
  }

  componentWillLoad() {
    this.Config = new ConfigService();
    this.Auth = new AuthService(this.Config.get('firebase'));
    // this.Database = new DatabaseService();

    this.defaultProps = {
      auth: this.Auth// ,
      // db: this.Database
    };

    this.Auth.onAuthChanged(data => {
      if (this.authorized !== (data != null)) {
        this.authorized = (data != null);
        this.showToast(this.authorized);
      }
    });
  }

  closeMenu() {
    const ionMenu: HTMLIonMenuElement = document.querySelector('ion-menu');
    ionMenu.close();
  }

  handleLogoutClick(event) {
    event.preventDefault();

    console.log('Logout Clicked');
    this.Auth.logout();
    this.authorized = false;
  }

  render() {
    return ([
      <ion-app>
        <ion-split-pane when="lg">
          <ion-menu content-id="app-content">
            <ion-content>
              <ion-list>
                <tracker-login-item authorized={this.authorized} Auth={this.Auth} onAuthClicked={ev => this.handleLogoutClick(ev)} ></tracker-login-item>
                {this.authorized
                  ? <ion-item href="/planner">Planner</ion-item>
                  : null
                }
                <ion-item href="/advancement">Advancement</ion-item>
              </ion-list>
            </ion-content>
          </ion-menu>
          <ion-page class="ion-page" id="app-content" main>
            <stencil-router>
              <stencil-route-switch scrollTopOffset={0}>
                {this.authorized
                  ? <stencil-route url="/" component="tracker-home" componentProps={this.defaultProps} exact={true} />
                  : <stencil-route url="/" component="tracker-login" componentProps={this.defaultProps} exact={true} />
                }
                <stencil-route url="/home" component="tracker-home" componentProps={this.defaultProps} />
                <stencil-route url="/login" component="tracker-login" componentProps={this.defaultProps} />
                <stencil-route url="/advancement" component="adv-ranger-groups" componentProps={this.defaultProps} />
                {this.authorized
                  ? <stencil-route url="/planner" component="tracker-planner" componentProps={this.defaultProps} />
                  : null
                }
                {this.authorized
                  ? <stencil-route url="/advancement/kids" component="adv-kids-page" componentProps={this.defaultProps} />
                  : null
                }
                {this.authorized
                  ? <stencil-route url="/advancement/discovery" component="adv-discovery-page" componentProps={this.defaultProps} />
                  : null
                }
                {this.authorized
                  ? <stencil-route url="/advancement/adventure" component="adv-adventure-page" componentProps={this.defaultProps} />
                  : null
                }
                {this.authorized
                  ? <stencil-route url="/advancement/expedition" component="adv-expedition-page" componentProps={this.defaultProps} />
                  : null
                }

                <stencil-route component="tracker-home" componentProps={this.defaultProps} />
              </stencil-route-switch>
            </stencil-router>
          </ion-page>
        </ion-split-pane>
      </ion-app>,
      <ion-toast-controller></ion-toast-controller>
    ]);
  }
}
