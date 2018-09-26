import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
//import * as favicon from 'serve-favicon';
import * as lib from './lib';
import * as util from './util';

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    util.getAuthenticatedUser(req, admin.auth())
        .then(decodedIdToken => {
            req.user = decodedIdToken;
            return next();
        }).catch(error => {
            console.error('Error while verifying Firebase ID token:', error);
            res.status(403).send('Unauthorized');
        });
};

// Express middleware that validates User Roles access with Firebase ID Tokens passed in the Authorization HTTP header.
const userAccessGranted = (req, res, next) => {
    console.log('Check if request is authorized with user roles access');
    
    util.isUserAccessible(req, admin.database())
            .then( () => next() )  
            .catch( error => {
                console.error('Error while verifying User Access from Firebase ID token:', error);
                res.status(403).send('Unauthorized');
            })
}

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
//app.use(favicon('./public/favicon.ico'));
app.use(cookieParser());
//app.use(validateFirebaseIdToken);
//app.use(userAccessGranted);

//API routes
app.route('/getPeople')
    .get( lib.getPeople )
    .post( lib.getPeople )

app.route('/getEvents')
    .get( lib.getEvents )
    .post( lib.getEvents )

app.route('/getEvent')
    .get( lib.getEvent )
    .post( lib.getEvent )

app.route('/getCalendars')
    .get( lib.getCalendars )
    .post( lib.getCalendars )

app.route('/getEligible')
    .get( lib.getEligible )
    .post( lib.getEligible )

app.route('/getTags')
    .get( lib.getTags )
    .post( lib.getTags )

app.route('/getFolders')
    .get( lib.getFolders )
    .post( lib.getFolders )

app.route('/updateEventCheckIn')
    .get( lib.updateEventCheckIn )
    .post( lib.updateEventCheckIn )

app.route('/updateEventCheckOut')
    .get( lib.updateEventCheckOut )
    .post( lib.updateEventCheckOut )

//Oupost91 API
app.route('/listEligible')
    .get( lib.listEligible )
    .post( lib.listEligible )

app.route('/getImage')
    .get( lib.getImage )
    .post( lib.getImage )

export const api = functions.https.onRequest((request, response) => {
    return app(util.wrapperURL(request), response)
});

/*
* Firebase database API
*/
export const updateBreezeAttendance = functions.database.ref('/lessons/{lessonID}/attendance').onWrite( (change, context) => {
    // Only edit data when it is first created or being updated.
    if (!change.after.exists()) {
        return null;        
    }
    let date
    let instance_id

    return  change.after.ref.parent.child('instance_id').once('value')
                .then( instanceSnapShot => instanceSnapShot.val() )
                .then( data => {
                    instance_id = data
                    return change.after.ref.parent.child('date').once('value')
                }).then( dateSnapShot => dateSnapShot.val() )
                .then( data => {
                    date = data
                    return change.after.ref.once('value')
                }).then( attendanceSnapShot => {
                    const promises = []
                    attendanceSnapShot.forEach( (childSnap: admin.database.DataSnapshot): boolean => {
                        if( childSnap.val() ) {
                            const req = {'query': {'person_id': childSnap.key.split('-').pop(), 'calendar': 'Royal Rangers'}}
                        
                            if( date !== null) {
                                req['query']['start_date'] = date
                            }
                            if( instance_id !== null && instance_id > 0) {
                                req['query']['instance_id'] = instance_id
                            }
                            
                            promises.push(lib.updateCheckIn(req))
                        }

                        return false;
                    })

                    return Promise.all(promises);
                })      
});

/*
* Firebase authentication API
*/
export const updateNewUser = functions.auth.user().onCreate( user => {
    //Check Breeze User
    return lib.listPeople(user)
        .then( res => res.json()[0] )
        .then( data => {
            // Build write data
            const content:{} = {displayName: user.displayName || data.force_first_name.concat(" ", data.last_name),
                                email: user.email,
                                userRoles: "Parent"}

            if(data.id !== '') {
                content['breezeID'] = data.id
            }
            return content;
        })
        .then( content => {
            return admin.database().ref('users').child(user.uid).set(content);
        })
        .catch( error => {
            console.error(error)
        });

});

export const cleanUpRemovedUser = functions.auth.user().onDelete( user => {
    return admin.database().ref('users').child(user.uid).remove();
});