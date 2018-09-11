import '@ionic/core';

import { Component, Prop, Listen, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

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
  //Database: DatabaseService;
  _msg: string;
  
  @State() defaultProps: {
    auth?: AuthService,
    db?: DatabaseService
  };
  @State() authorized: boolean = false;
    
  @Prop({ connect: 'ion-toast-controller ' }) toastCtrl: HTMLIonToastControllerElement;
  @Prop() history: RouterHistory;

  async showToast(isSignedIn: boolean, position: 'top' | 'bottom' | 'middle' = 'bottom') {
    this._msg = 'Signed Out!';
    if(isSignedIn) {
      this._msg = 'Welcome Back, ';
    }
    const toast = await this.toastCtrl.create({
      message: this._msg,
      duration: 2000,
      position
    });

    toast.present();
  };

  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast:any = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });
    await toast.present();
    await toast.onWillDismiss()
    window.location.reload();
  }

  componentWillLoad() {
    this.Config = new ConfigService();
    this.Auth = new AuthService(this.Config.get('firebase'));
    //this.Database = new DatabaseService();
    
    this.defaultProps = {
      auth: this.Auth//,
      //db: this.Database
    };
    
    this.Auth.onAuthChanged(data => {
      this.authorized = (data != null);
      this.showToast(this.authorized);
    })
  }

  @Listen('body:ionToastWillDismiss')
  reload() {
    window.location.reload();
  }

  closeMenu() {
    const ionMenu: HTMLIonMenuElement = document.querySelector('ion-menu');
    ionMenu.close();
  }

  handleAuthClick(event) {
    event.preventDefault();
    if(!this.authorized) {
      console.log('Click event');
      this.history.push(`/login`, {});
    } else {
      this.Auth.logout(); 
    }

  }
  render() {
    return (
      <ion-app>
        <ion-split-pane when="lg">
          <ion-menu content-id="app-content">
            <ion-content>
              <ion-list>
                <ion-item lines='full' onClick={ (event: UIEvent) => this.handleAuthClick(event)}>
                  <ion-avatar slot="start" >
                    <img src={this.authorized ? this.Auth.isLoggedIn().photoURL : "./build/app/svg/md-contact.svg"} />
                  </ion-avatar>
                  <ion-label>
                    {this.authorized
                      ? "Sign Out"
                      : "Sign In"
                  }
                  </ion-label>
                </ion-item>
                {this.authorized
                  ? <ion-item href="/planner">Planner</ion-item>
                  : null
                }
                <ion-item href="/advancement">Advancement</ion-item>
              </ion-list>
              <ion-toast-controller></ion-toast-controller>
            </ion-content>
          </ion-menu>
          <div main id="app-content">
            <stencil-router id="router">
            <stencil-route-redirect url="/" />
              {this.authorized
                ? <stencil-route url="/" component="tracker-home" componentProps={this.defaultProps} />
                : <stencil-route url="/" component="tracker-login" componentProps={this.defaultProps} />
              }
              <stencil-route url="/home" component="tracker-home" componentProps={this.defaultProps} />
              <stencil-route url="/login" component="tracker-login" componentProps={this.defaultProps} />
              <stencil-route url="/advancement" component="adv-ranger-list" componentProps={this.defaultProps} />
              {this.authorized
                ? <stencil-route url="/planner" component="tracker-planner" componentProps={this.defaultProps} />
                : null
              }
            </stencil-router>
            <ion-nav swipeGesture={false} main />
          </div>
        </ion-split-pane>
      </ion-app>
    );
  }
}
