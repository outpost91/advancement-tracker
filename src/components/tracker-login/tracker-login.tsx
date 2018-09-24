import { Component, Prop } from '@stencil/core';

import { AuthService } from '../../services/auth';

@Component({
  tag: 'tracker-login',
  styleUrl: 'tracker-login.scss'
})
export class AppHome {
  @Prop() auth: AuthService;

  componentWillLoad() {
    console.log("Login Page will be loaded")
   // ON LOAD
  }
  componentDidLoad() {
    console.log("Login Page loaded")
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
                <ion-button onClick={(event: UIEvent) => this.login(event, "google")}>
                  <ion-icon name="add"></ion-icon>
                </ion-button>
              </ion-item>

            </ion-list>
          </ion-card-content>
        </ion-card>
    );
  }
}
