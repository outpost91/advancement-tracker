/**
 * @module Services
 */
import firebase from 'firebase/App';
import 'firebase/database';
import 'firebase/functions';
// import fetch from 'node-fetch';

export class DatabaseService {
  service: firebase.database.Reference;
  watchers: any = {};
  options: any;
  photoURLBase: string;
  dbURLBase: string;

  constructor() {
    this.service = firebase.database().ref();
    this.photoURLBase = 'https://files.breezechms.com/';
    this.dbURLBase = 'https://ranger-tracker.firebaseapp.com';
  }

  fetch_options(options: any) {
    this.options = options;
  }

  async add_lesson(data) {
    return this.service.child('lessons').push(data);
  }

  async merits(group: string, type: string | null | undefined) {
    let _group: string | null | undefined;
    let _type: string | null | undefined;

    _group = (group != null && group !== '') ? group.toLowerCase() : null;
    _type = (type !== undefined && type != null && type !== '') ? type.toLowerCase() : null;

    if (_group === null) {
        console.log('Group Name must be defined!');

        return [];
    }

    return this.service.child('merits').orderByChild('name')
        .once('value')
        .then(snapshot => {
            const snapdata = [];
            snapshot.forEach(childsnap => {
                if ((childsnap.child('group').val().toLowerCase() === _group && _type == null)
                 || (childsnap.child('group').val().toLowerCase() === _group && childsnap.child('type').val().toLowerCase() === _type)) {
                    snapdata.push({ value: childsnap.child('name').val(), key: childsnap.key });
                }
            });

            return snapdata;
        });
  }

  async bibleMerits(group: string) {
    return this.merits(group, 'bible');
  }

  async skillMerits(group: string) {
    return this.merits(group, 'skill');
  }

  async requirements(key: string) {
    return this.service.child('merits/' + key)
        .once('value')
        .then(snapshot => {
            if (snapshot.hasChild('num-reqs')
            && snapshot.child('num-reqs').val()) {
                return parseInt(snapshot.child('num-reqs').val(), 10);
            }
        })
        .catch(_ => {
            return 0;
        });
  }

  async call(functionName: string, payload: any = {}) {
    return firebase.functions().httpsCallable(functionName)(payload);
  }

  async fetch(baseUrl: string, params: {}) {
    const paramsList = [];
    for (const x in params) {
        paramsList.push(x.concat('=', params[x]));
    }

    return fetch(this.dbURLBase.concat(baseUrl, '?', paramsList.join('&')), this.options);
  }

  async fetch_attendance(params: {
                            calendar: string,
                            start_date: string,
                            end_date: string,
                            instance_id?: string}) {
    this.options.method = 'GET';

    return this.fetch('/listEligible', params)
      .then(res => res.json());
  }

  async fetch_image(img: string) {
    this.options.method = 'GET';
    img = img.startsWith('/') ? img : '/' + img;

    return this.fetch('/getImage', { endpoint: img });
  }

}
