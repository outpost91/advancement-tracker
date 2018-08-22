/**
 * Returns the request url prepended with a `/`
 *
 * This endpoint supports CORS.
 */
export const wrapperURL = req => {
    if (!req.path) {
        console.log(req)
        req.url = '/' + req.url // prepend '/' to keep query params if any
    }
    return req
}

/**
 * The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 * `Authorization: Bearer <Firebase ID Token>`
 * or by passing a "__session" cookie.
 * Return decodedIdToken 
 */
export const getAuthenticatedUser = (req, auth) => {
    return new Promise((resolve, reject) => {
        if( (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))
         && (!req.cookies.__session) ) {
            reject( new ReferenceError('No Firebase ID token was passed as a Bearer token in the Authorization header.'.concat(
                'Make sure you authorize your request by providing the following HTTP header:',
                'Authorization: Bearer <Firebase ID Token>',
                'or by passing a "__session" cookie.')))
        }

        // Find ID token looking in request headers first
        let idToken
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1]
        } else {
            // Read the ID Token from cookie.
            idToken = req.cookies.__session
        }

        // verify the ID token
        auth.verifyIdToken(idToken)
            .then( decodedIdToken => resolve(decodedIdToken) )
            .catch( error => reject(error))
    })
}

/**
 * The Firebase ID token needs to be passed as a user token in the Authorization HTTP header like this:
 * `user: <Decoded Firebase ID Token>`.
*/
export const isUserAccessible = (req, database) => {
    const ref = database.ref()
    return ref.child('users/' + req.user.uid).once('value')
                .then( snapshot => {
                    return ref.child('userRoles/' + snapshot.child('userRole').val()).once('value');
                })
                .then( snapshot => {
                    console.log('URL:', req.url)
                    
                    if( (req.url.startsWith('/list') || req.url.startsWith('/get'))
                     && (!snapshot.child('canRead').val()                         ) ){
                        throw new ReferenceError('Read access needed!')
                    }
                    else if( (req.url.startsWith('/add')      ) 
                          && (!snapshot.child('canAdd').val() ) ){
                        throw new ReferenceError('Add access needed!')
                    }
                    else if( (req.url.startsWith('/update')    ) 
                          && (!snapshot.child('canEdit').val() ) ){
                        throw new ReferenceError('Edit access needed!')
                    }
                    else if( (req.url.startsWith('/delete')      ) 
                          && (!snapshot.child('canDelete').val() ) ){
                        throw new ReferenceError('Delete access needed!')
                    }
                })
}
