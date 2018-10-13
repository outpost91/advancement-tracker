import { Component, Element, Prop } from '@stencil/core';

import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login',
  styleUrl: 'tracker-login.scss'
})
export class TrackerLogin {
  @Element() el: HTMLTrackerLoginElement;

  @Prop() auth: AuthService;

  protected login(event, type = 'email') {
    event.preventDefault();

    if (this.auth === undefined) {
      console.log('auth is not defined');

      return;
    }

    if (type === 'email') {
      const email: HTMLInputElement = this.el.querySelector('ion-input#email_id input');
      const pass: HTMLInputElement = this.el.querySelector('ion-input#pass_id input');

      this.auth.withEmail(email.value, pass.value);
    } else {
      this.auth.withSocial(type).then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  protected register(event, type = 'email') {
    event.preventDefault();

    if (type === 'email') {
      const email: HTMLInputElement = this.el.querySelector('ion-input#email_id input');
      const pass: HTMLInputElement = this.el.querySelector('ion-input#pass_id input');

      this.auth.createUser(email.value, pass.value);
    }
  }

  render() {
    return (
        <ion-card>
          <ion-card-header>
            Login
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="none">

              <ion-item lines="inset">
                <ion-label position="floating">Email</ion-label>
                <ion-input type="text" id="email_id"></ion-input>
              </ion-item>

              <ion-item lines="inset">
                <ion-label position="floating">Password</ion-label>
                <ion-input type="password" id="pass_id"></ion-input>
              </ion-item>

              <ion-item>
                <ion-button shape="round" size="large" fill="outline" onClick={(event: UIEvent) => this.login(event, 'email')}>
                  Login
                  <ion-icon slot="start" name="log-in"></ion-icon>
                </ion-button>
                <ion-button shape="round" size="large" fill="outline" onClick={(event: UIEvent) => this.login(event, 'google')}>
                  <ion-icon name="logo-google"></ion-icon>
                </ion-button>
              </ion-item>
              <ion-item>
                <ion-button onClick={(event: UIEvent) => this.register(event, 'email')}>
                  Register
                  <ion-icon slot="start" name="create"></ion-icon>
                </ion-button>
              </ion-item>

            </ion-list>
          </ion-card-content>
        </ion-card>
    );
  }
}
