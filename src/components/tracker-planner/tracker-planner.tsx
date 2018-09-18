import { Component, Listen, Prop, State } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';
// import { FetchService } from '../../services/fetch';

@Component({
  tag: 'tracker-planner',
  styleUrl: 'tracker-planner.scss'
})
export class TrackerPlanner {

  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;
  // @Prop() fetch?: FetchService;

  @State() value: string;
  @State() selectValue: string;
  @State() secondSelectValue: string;
  @State() avOptions: any[];

  @Listen('ionChange')
  onIonChange(event: CustomEvent) {
    console.log('Received the custom ionChange event: ', event.detail);

  }


  handleSubmit(event) {
    event.preventDefault();
    
    console.log(event.target.value);
    console.log(this.value);
  }

  handleChange(event) {
    this.value = event.target.value;

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  //@Listen()
  //handleSelect(event) {
  //  console.log(event.target.value);
  //  this.selectValue = event.target.value;
  //}

  handleSecondSelect(event) {
    console.log(event.target.value);
    this.secondSelectValue = event.target.value;
  }

  render() {
    return (
      <ion-page>
        <ion-header>
         <ion-title>Royal Ranger Planner</ion-title> 
        </ion-header>
        <ion-content>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <ion-list lines="none">
              <ion-item>
                <ion-label position="floating">Ranger Meeting</ion-label>
                <ion-datetime display-format="DDDD MMMM D YYYY" picker-format="MMMM D YYYY"></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-segment>
                  <ion-segment-button value="kids">
                    Ranger Kids
                  </ion-segment-button>
                  <ion-segment-button value="discovery">
                    Discovery
                  </ion-segment-button>
                  <ion-segment-button value="Adventure">
                    Adventure
                  </ion-segment-button>
                  <ion-segment-button value="Expedition">
                    Expedition
                  </ion-segment-button>
                </ion-segment>
              </ion-item>
              <ion-item>
              <ion-label>Action Sheet</ion-label>
                <ion-select id="customActionSheetSelect" interface="action-sheet" placeholder="Select One">
                  <ion-select-option value="red">Red</ion-select-option>
                  <ion-select-option value="purple">Purple</ion-select-option>
                  <ion-select-option value="yellow">Yellow</ion-select-option>
                  <ion-select-option value="orange">Orange</ion-select-option>
                  <ion-select-option value="green">Green</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-button size="large" type="submit">Submit</ion-button>
              </ion-item>
            </ion-list>
          </form>
        </ion-content>
      </ion-page>
    );
  }
}