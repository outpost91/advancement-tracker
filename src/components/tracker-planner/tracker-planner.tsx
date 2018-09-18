import { Component, Listen, Prop, State } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/Database';
declare global {
  namespace advancementTracker {
    export interface IRequirements {
      'label': string;
      'total': number;
    }
  }
}

@Component({
  tag: 'tracker-planner',
  styleUrl: 'tracker-planner.scss'
})
export class TrackerPlanner {
  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  @State() bible: any = [];
  @State() bibleRequirementLabel: string;
  @State() bibleRequirements: any = [];
  @State() groupValue: string;
  @State() meritRequirementLabel: string;
  @State() meritRequirements: any = [];
  @State() merits: any = [];
  @State() requirements: advancementTracker.IRequirements[] | undefined[] = [];

  handleSubmit(event) {
    event.preventDefault();

    console.log(event.target.value);
    // console.log(this.value);
  }

  handleChange(event) {
    // this.value = event.target.value;

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid');
    }
  }


  // @Listen('ionChange')
  // onIonChange(event: CustomEvent) {
  //  console.log("Event emitted")
  //  console.log(event.detail);
  //  this.selectValue = event.target.value;
  // }

  @Listen('trackerSegmentChange')
  onTrackerSegmentChange(event: CustomEvent) {
    this.groupValue = event.detail.value;
    this.db.merits(event.detail.value).then(value => {
      this.merits = value;
    });
    if (this.groupValue !== 'Ranger Kids') {
      // this.db.bibles(event.detail.value).then(value => {
      //  this.merits = value;
      // })
    }
  }

  @Listen('trackerSelectChange')
  onTrackerSelectChange(event: CustomEvent) {
    if (event.detail.id === 'merit-id') {
      this.meritRequirementLabel = event.detail.text;
      this.db.requirements(event.detail.value).then(value => {
        // Clear out exsiting array
        this.meritRequirements = [];

        // build current array
        for (let index = 0; index < value; index++) {
          this.meritRequirements = [...this.meritRequirements, { id: index + 1, value: 'Requirement ' + (index + 1) }];
        }
      });
    }
    if (event.detail.id === 'bible-id') {
      this.bibleRequirementLabel = event.detail.text;
      this.db.requirements(event.detail.value).then(value => {
        // Clear out exsiting array
        this.bibleRequirements = [];

        // build current array
        for (let index = 0; index < value; index++) {
          this.bibleRequirements = [...this.bibleRequirements, { id: index + 1, value: 'Requirement ' + (index + 1) }];
        }
      });
    }
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
              <tracker-planner-date-item id="date" />
              <tracker-planner-segment-item id="group-id" items={['one', 'two', 'three']} />
              <tracker-planner-select-item id="merit-id" items={this.merits} label="Merit Lesson" />
              <tracker-planner-checkbox-item id="merit-requirements" items={this.meritRequirements} label={(this.meritRequirementLabel !== '' && this.meritRequirementLabel !== undefined) ? this.meritRequirementLabel + ' Requirements:' : 'Requirements'} />
              {(this.groupValue !== 'Ranger Kids')
                ? <tracker-planner-select-item id="bible-id" items={this.bible} label="Bible Lesson" />
                : null
              }
              {(this.groupValue !== 'Ranger Kids')
                ? <tracker-planner-checkbox-item id="bible-requirements" items={this.bibleRequirements} label={(this.bibleRequirementLabel !== '' && this.bibleRequirementLabel !== undefined) ? this.bibleRequirementLabel + ' Requirements:' : 'Requirements'} />
                : null
              }
              <tracker-planner-checkbox-item id="attendance" items={0} label="Attendance" />
              <ion-item>
                <ion-button type="submit" slot="end">Submit</ion-button>
              </ion-item>
            </ion-list>
          </form>
        </ion-content>
      </ion-page>
    );
  }
}