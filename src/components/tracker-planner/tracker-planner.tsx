import { Component, Element, Listen, Prop, State } from '@stencil/core';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/Database';
import { formatDate } from '../../services/utils';

declare global {
  namespace advancementTracker {
    export interface IRequirements {
      'label': string;
      'reqMap': {id: number, value: string}[];
    }
  }
}
@Component({
  tag: 'tracker-planner',
  styleUrl: 'tracker-planner.scss'
})

export class TrackerPlanner {
  instance_id: string;
  bibleSelected: string;
  meritSelected: string;

  @Element() el: HTMLTrackerPlannerElement;

  @Prop() auth: AuthService;
  @Prop() db?: DatabaseService;

  @State() attendance: any[];
  @State() authorized = false;
  @State() bibles: { key: string,
                     value: string
                   }[];
  @State() groupValue: string;
  @State() merits: { key: string,
                     value: string
                   }[];
  @State() bibleRequirements: advancementTracker.IRequirements;
  @State() meritRequirements: advancementTracker.IRequirements;

  componentWillLoad() {
    this.auth.onAuthChanged(data => {
      this.authorized = (data != null);
    });

    this.bibleRequirements = {label: '',
                              reqMap: []};
    this.meritRequirements = {label: '',
                              reqMap: []};
  }

  filter_attendance(data) {
    if (data !== false) {
      this.attendance = data
                          .sort((a, b) => {
                            const x = a['last_name'].toLowerCase().concat(', ', a['force_first_name'].toLowerCase());
                            const y = b['last_name'].toLowerCase().concat(', ', b['force_first_name'].toLowerCase());

                            return (x < y) ? -1 : (x > y) ? 1 : 0; })
                          .map(entry => ({ id: entry.id,
                                           value: entry.force_first_name + ' ' + entry.last_name,
                                           img: (entry.path !== '')
                                            ? this.db.photoURLBase.concat(entry.path)
                                            : './build/app/svg/md-contact.svg'}));
    }
  }

  async presentAlert(data, params) {
    const alertController = this.el.querySelector('ion-alert-controller');
    await alertController.componentOnReady();

    const alert = await alertController.create({
      header: 'Multiple events found!',
      subHeader: 'Please select an event:',
      inputs: data
                .filter(x => x.start_datetime.startsWith(params.start_date))
                .reduce((ary, x) => {
                  ary.push({ type: 'radio', value: x.id, label: x.name });

                  return ary;
                }, []),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: async (id) => {
            console.log(id);
            params = { ...params, instance_id: id };

            const response = await this.db.fetch_attendance(params);
            this.filter_attendance(response);
          }
        }
      ]
    });

    await alert.present();

  }

  async get_attendance() {
    const date = formatDate((this.el.querySelector('tracker-planner-date-item ion-datetime') as HTMLIonDatetimeElement).value);

    let params: {
                  calendar: string,
                  start_date: string,
                  end_date: string,
                  instance_id?: string
                } = {
                      calendar: 'Royal Rangers',
                      start_date: date,
                      end_date: date
                    };

    if (this.instance_id !== undefined && this.instance_id !== '') {
        params = { ...params, instance_id: this.instance_id };
      }

    //  data = await this.db.fetch_attendance(params);
    const data = await this.db.getAttendance();

    if (data.length > 1
    && data[0].oid !== undefined
    && data[0].event_id !== undefined) {
      await this.presentAlert(data, params);
    } else {
      this.filter_attendance(data);
    }
  }

  resetMerits() {
    (this.el.querySelector('tracker-planner-select-item ion-select[id=\'merit-id\']') as HTMLIonSelectElement).value = undefined;
    (this.el.querySelector('tracker-planner-select-item ion-select[id=\'bible-id\']') as HTMLIonSelectElement).value = undefined;
    (this.el.querySelector('tracker-planner-select-item') as HTMLStencilElement).forceUpdate();
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const date = formatDate((this.el.querySelector('tracker-planner-date-item ion-datetime') as HTMLIonDatetimeElement).value);
    const _merits = Array.from(this.el.querySelectorAll('ion-select'))
                    // .filter(el => el.querySelector('input').name === 'bible-id' || el.querySelector('input').name === 'merit-id')
                    .reduce((ret, el) => {
                      if (el.querySelector('input').name === 'bible-id') {
                        return { ...ret, [el.querySelector('input').name]: this.bibleSelected };
                      } else if (el.querySelector('input').name === 'merit-id') {
                        return { ...ret, [el.querySelector('input').name]: this.meritSelected };
                      }
                    }, {});

    const cb = Array.from(this.el.querySelectorAll('ion-checkbox'))
                    .filter(el => (el as HTMLIonCheckboxElement).checked)
                    .map(el => ({ [el.querySelector('input').name]: (el as HTMLIonCheckboxElement).checked }))
                    .reduce((ret, entry) => ({ ...ret, ...entry }), {});

    let merit_reqs: {};
    Object.keys(cb).forEach(id => {
      if (id.startsWith('merit')) {
        const parse = id.split('-');
        merit_reqs = { ...merit_reqs, [parse[parse.length - 1].toString()]: cb[id] };
      }
    });

    let bible_reqs: {};
    Object.keys(cb).forEach(id => {
      if (id.startsWith('bible')) {
        const parse = id.split('-');
        bible_reqs = { ...bible_reqs, [parse[parse.length - 1].toString()]: cb[id] };
      }
    });

    let _attendance: {};
    Object.keys(cb).forEach(id => {
      if (id.startsWith('attendance')) {
        const parse = id.split('-');
        _attendance = { ..._attendance, [parse[parse.length - 1].toString()]: cb[id] };
      }
    });

    let data: {} = { 'date': date,
                     'attendance': _attendance };

    if (_merits['bible-id'] !== undefined) {
      data = { ...data, 'bible-name': _merits['bible-id'], 'bible-reqs': bible_reqs || {} };
    }

    if (_merits['merit-id'] !== undefined) {
      data = { ...data, 'merit-name': _merits['merit-id'], 'merit-reqs': merit_reqs || {} };
    }

    console.log('data', data);
    // build submission to firebase
    this.db.add_lesson(data)
      .then(response => console.log(response));
  }

  @Listen('trackerSegmentChange')
  async onTrackerSegmentChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.groupValue = event.detail.value;

    this.resetMerits();

    this.merits = await this.db.skillMerits(event.detail.value);

    if (this.groupValue.toLowerCase() !== 'ranger kids') {
      this.bibles = await this.db.bibleMerits(event.detail.value);
    }

    // Build attendance list
    this.get_attendance();
  }

  @Listen('trackerSelectChange')
  onTrackerSelectChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Refresh the requirments list for the selected merit
    this.db.requirements(event.detail.value).then(value => {
      // Clear out exsiting array
      let mapping = [];

      // build current array
      for (let index = 0; index < value; index++) {
        mapping = [...mapping, { id: index + 1, value: 'Requirement ' + (index + 1) }];
      }

      // Update requirments checkbox state
      if (event.detail.id === 'bible-id') {
        this.bibleSelected = event.detail.text;
        this.bibleRequirements = {label: event.detail.text,
                                  reqMap: mapping};
      } else if (event.detail.id === 'merit-id') {
        this.meritSelected = event.detail.text;
        this.meritRequirements = {label: event.detail.text,
                                  reqMap: mapping};
      }
    });
  }

  render() {
    return (
      [<ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Royal Ranger Planner</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <ion-list lines="none">
              <tracker-planner-date-item id="date" label="Ranger Meeting" />
              <tracker-planner-segment-item id="group-id" />
              <tracker-planner-select-item id="merit-id" items={this.merits} label="Merit Lesson" />
              <tracker-planner-checkbox-item
                id="merit-requirements"
                items={this.meritRequirements.reqMap}
                label={(this.meritRequirements.label !== undefined
                     && this.meritRequirements.label !== '')
                        ? this.meritRequirements.label + ' Requirements:'
                        : 'Requirements'} />
              <tracker-planner-select-item id="bible-id" items={this.bibles} label="Bible Lesson" />
              <tracker-planner-checkbox-item
                id="bible-requirements"
                items={this.bibleRequirements.reqMap}
                label={(this.bibleRequirements.label !== undefined
                     && this.bibleRequirements.label !== '')
                        ? this.bibleRequirements.label + ' Requirements:'
                        : 'Requirements'} />
              <tracker-planner-checkbox-item
                id="attendance"
                items={this.attendance}
                label="Attendance:" />
              <ion-item-divider color="dark">
                <ion-label>
                  Submit Lesson Plan
                </ion-label>
              </ion-item-divider>
              <ion-item>
                <ion-button size="large" fill="outline" shape="round" type="submit" slot="end">Submit Lesson</ion-button>
              </ion-item>
            </ion-list>
          </form>
        </ion-content>
      </ion-page>,
       <ion-alert-controller />
    ]);

  }
}
