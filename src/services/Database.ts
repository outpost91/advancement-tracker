// import firebase from 'firebase';
// import '@firebase/firestore'
declare var firebase: any;

export class DatabaseService {
  public service: any;
  public watchers: any = {};
  public options: any;

  public constructor() {
    this.service = firebase.database().ref();
  }

  public fetch_options(options: any) {
    this.options = options;
  }

  public async merits(group: string) {
    const data = [];

    await this.service.child('merits').orderByChild('name')
        .once('value')
        .then( snapshot => {
            snapshot.forEach( childsnap => {
                if (childsnap.child('group').val() === group) {
                    data.push({ value: childsnap.child('name').val(), key: childsnap.key });
                }
            })
        })
    
    return data;
  }

  public async requirements(key: string) {
    return await this.service.child('merits/' + key)
        .once("value")
        .then(snapshot => {
            if( snapshot.hasChild('num-reqs')
            && snapshot.child('num-reqs').val() ) {
                return parseInt(snapshot.child('num-reqs').val());
            }
        })
        .catch( error => {
            console.log(error);
            
            return 0;
        });
  }

  public async all(collectionName: string): Promise<any> {
    const collection = await this.get(collectionName);
    const data = {};

    await collection.forEach(doc => {
      data[doc.id] = doc.data();
    });

    return data;
  }

  public async call(functionName: string, payload: any = {}) {
    return firebase.functions().httpsCallable(functionName)(payload);
  }

  public async list(collectionName: string) {
    const collection = await this.get(collectionName);
    const data = [];

    await collection.forEach(doc => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }

  public async add(collectionName: string, data: any, id?: number | string) {
    let document = await this.collection(collectionName);
    document = id ? document.doc(id) : document.doc();

    return document.set(data);
  }

  public collection(collectionName: string) {
    return this.service.collection(collectionName);
  }

  public get(collectionName: string) {
    return this.collection(collectionName).get();
  }

  public document(collectionName: string, id: string) {
    return this.collection(collectionName).doc(id);
  }

  public getDocument(collectionName: string, id: string) {
    return this.document(collectionName, id).get();
  }

  public async find(collectionName: string, id: string) {
    const document = await this.getDocument(collectionName, id);

    return { ...document.data(), id: document.id };
  }

  public async update(collectionName: string, id: string, data: any) {
    const document = this.document(collectionName, id);
    await document.set(data, { merge: true });
    const newDocument = await document.get();

    return newDocument.data();
  }

  public watchDocument(collectionName: string, id: string, callback) {
    this.watchers[`${collectionName}:${id}`] = this.document(
      collectionName,
      id
    ).onSnapshot(doc => {
      if (callback && typeof callback === 'function') {
        callback({ data: doc.data() });
      }
    });
  }

  public unwatchDocument(collectionName: string, id: string) {
    const watcherName = `${collectionName}:${id}`;
    if (
      this.watchers[watcherName] &&
      typeof this.watchers[watcherName] === 'function'
    ) {
      this.watchers[watcherName]();

      return true;
    } else {
      console.log(`There is no watcher running on ${watcherName} document.`);

      return false;
    }
  }
}
