/**
 * @module Services
 */
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
// import { TwitterConnect } from '@ionic-native/twitter-connect';
import firebase from 'firebase/app';
import 'firebase/auth';

export class AuthService {
  public service: firebase.auth.Auth;
  public session: any;
  public fetch_options = {
      method: '',
      headers: { 'Authorization': '' },
      mode: 'cors'
  };

  constructor(
    // private facebook: Facebook,
    // private twitter: TwitterConnect
    config?: any
  ) {

    let firstRun = false;
    if (firebase.apps.length === 0) {
      console.log('First Run Initializing App');
      firebase.initializeApp(config);
      firstRun = true;
    }
    this.service = firebase.auth();
    if (firstRun) {
      this.service.getRedirectResult().then(data => {
        if (data && data.user) {
          this.emitLoggedInEvent(data);
        }
      });
    }
  }

  async onEmailLink() {
    if (this.service.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      const authUser = await this.service.signInWithEmailLink(email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');

      this.emitLoggedInEvent(authUser);

      return authUser;
    }
  }

  createCaptcha(buttonId: string) {
    (window as any).RecaptchaVerifier = new firebase.auth.RecaptchaVerifier(buttonId, {
      'size': 'invisible',
      'callback'() {
        // On Capture Creation
      }
    });
  }

  withPhoneNumber(phoneNumber: string, capId: any) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        phoneNumber = '+' + phoneNumber;
        window.localStorage.setItem('phoneForSignIn', phoneNumber);

        return this.service.signInWithPhoneNumber(phoneNumber, capId);
  }

  withEmailLink(email: string, actionCodeSettings: any) {
    window.localStorage.setItem('emailForSignIn', email);

    return this.service.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  anonymously() {
    return this.service.signInAnonymously();
  }

  onAuthChanged(callback) {
    this.service.onAuthStateChanged(session => {
      if (!session || (!session.emailVerified && session.providerData && session.providerData[0].providerId === 'password')) {
        return false;
      }

      if (session) {
        localStorage.setItem('tmg:session', JSON.stringify(session));
      }
      session.getIdToken()
        .then((token: string) => {
          this.fetch_options.headers.Authorization = 'Bearer ' + token;
        })
        .catch(e => {
          console.log(e);
        });

      if (callback && typeof callback === 'function') {
        callback(session);
      }
    });
  }

  getFromStorage() {
    return localStorage.getItem('referaflood:session') ? JSON.parse(localStorage.getItem('referaflood:session')) : null;
  }

  isLoggedIn() {
    return this.service.currentUser ? this.service.currentUser : this.getFromStorage();
  }

  emitLoggedInEvent(data) {
    document.body.dispatchEvent(new CustomEvent('authLoggedIn', { detail: { data } }));
  }

  emitLoggedOutEvent() {
    document.body.dispatchEvent(new CustomEvent('authLoggedOut', { detail: {} }));
  }

  createUser(email: string, password: string) {
    console.log('am I here?');
    this.service.createUserWithEmailAndPassword(email, password)
      .then(data => data)
      .catch(error => error);
  }

  sendEmailVerification(options?) {
    return this.service.currentUser.sendEmailVerification(options ? options : null);
  }

  sendPasswordReset(emailAddress: string, options?) {
    return this.service.sendPasswordResetEmail(emailAddress, options ? options : null);
  }

  withEmail(email: string, password: string) {
    return new Promise((resolve, reject) => {
      try {
        this.service.signInWithEmailAndPassword(email, password).then(user => {
          this.emitLoggedInEvent({ user });
          resolve({ data: { user } });
        }).catch((error) => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // facebookNative(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         if (this.platform.is('cordova')) {
  //             this.facebook.login(['email', 'public_profile', 'user_friends'])
  //                 .then((facebookData: FacebookLoginResponse) => {
  //                     const credential = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
  //                     this.service.signInWithCredential(credential).then((firebaseData) => {
  //                         resolve(firebaseData);
  //                     });
  //                 }, (error) => {
  //                     reject(error);
  //                 });
  //         } else {
  //             reject({ message: 'This platform does not support native login.' });
  //         }
  //     });
  // }

  googleNative(): Promise<any> {
    return new Promise((resolve, reject) => {
      (window as any).plugins.googleplus.login({
        webClientId: '423724975087-uqfg4lrfe2fsal8v1oihf5mcj3ikvqnl.apps.googleusercontent.com',
        offline: true
      }, (googleData) => {
        const credential = firebase.auth.GoogleAuthProvider.credential(googleData.idToken);
        this.service.signInWithCredential(credential).then((firebaseData) => {
          resolve(firebaseData);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  // twitterNative(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         this.twitter.login().then((twitterData) => {
  //             const credential = firebase.auth.TwitterAuthProvider.credential(twitterData.token, twitterData.secret);
  //             this.service.signInWithCredential(credential).then((firebaseData) => {
  //                 resolve(firebaseData);
  //             });
  //         }, (error) => {
  //             reject(error);
  //         });
  //     });
  // }

  withSocial(network: string, redirect = false): Promise<any> {
    // let provider;
    // return new Promise((resolve, reject) => {
    //     if (this.platform.is('cordova')) {
    //         if (network === 'facebook') {
    //             this.facebookNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else if (network === 'google') {
    //             this.googleNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else if (network === 'twitter') {
    //             this.twitterNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else {
    //             reject({ message: 'A social network is required or the one provided is not yet supported.' });
    //         }
    //     } else {

    //     }
    // });
    let provider;
    let shouldRedirect = redirect;
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running in PWA mode...');
      shouldRedirect = shouldRedirect ? shouldRedirect : true;
    }

    return new Promise((resolve, reject) => {
      // console.log('here or not?');

      // if ((<any>window).Capacitor.isNative) {
      //   console.log('what')
      //   if (network === 'google') {
      //     this.googleNative().then((result) => {
      //       resolve(result);
      //     });
      //   }
      // }
        if (network === 'facebook') {
          provider = new firebase.auth.FacebookAuthProvider();
        } else if (network === 'google') {
          provider = new firebase.auth.GoogleAuthProvider();
        } else if (network === 'twitter') {
          provider = new firebase.auth.TwitterAuthProvider();
        } else {
          reject({ message: 'A social network is required or the one provided is not yet supported.' });
        }
        if (shouldRedirect) {
          this.service.signInWithRedirect(provider).then(data => {
            this.emitLoggedInEvent(data);
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        } else {
          this.service.signInWithPopup(provider).then(data => {
            this.emitLoggedInEvent(data);
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        }
    });
  }

  logout() {
    this.emitLoggedOutEvent();

    return this.service.signOut();
  }

  async updatePassword(newPassword: string) {
    console.log(this.service.currentUser);
    // await user.reauthenticateWithCredential(credential);

    return this.service.currentUser.updatePassword(newPassword);
  }
}
