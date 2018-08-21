import '@ionic/core';
import { Component, Prop } from '@stencil/core';

import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login',
  styleUrl: 'tracker-login.scss'
})
export class AppHome {
  @Prop() auth: AuthService;

  componentDidLoad() {
   // ON LOAD
  }

  login(event, type: string = 'email') {
    event.preventDefault();

    if(type === 'email') {
      console.log('email login type');
    } else {
      this.auth.withSocial(type).then((data) => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <ion-content>
        <ion-card>
          <ion-card-header>
            Login
          </ion-card-header>
          <ion-card-content>
            <ion-list>

              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input type="text" id="email_id"></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="floating">Password</ion-label>
                <ion-input type="password"  id="pass_id"></ion-input>
              </ion-item>

              <ion-item>
                <ion-fab horizontal='start' vertical='bottom' edge>
                  <button ion-fab onClick={(event:UIEvent) => this.login(event, "google")}><ion-icon name="add"></ion-icon></button>
                </ion-fab>
              </ion-item>

            </ion-list>
          </ion-card-content>
        </ion-card>
      </ion-content>
    );
  }
}
