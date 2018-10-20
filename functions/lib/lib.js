"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const breeze = require("./breeze");
const breeze_fetch = require("./breeze-fetch");
const breeze_key = require("./breeze-key.json");
/**
 * Create api object for breezeCHMS
 *   Usage:
 *   const brz = breeze.BreezeApi('https://<demo>.breezechms.com', '5c2d2cbacg3...')
 */
const brz = breeze.BreezeApi(breeze_fetch.BreezeAsync(breeze_key.config.breeze_url, breeze_key.config.api_key));
const fls = breeze.BreezeApi(breeze_fetch.BreezeAsync(breeze_key.config.files_url, breeze_key.config.api_key));
/**
 * Generic HTTPfunction call for Breeze API object
 * handles response
 */
const _APIHandler = (fnObj, res) => {
    fnObj
        .then(data => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.send(JSON.stringify(data));
    })
        .catch(error => {
        console.error(error);
        res.send(error);
    });
};
/**
 * Generic HTTPfunction call for Breeze API object
 * handles response
 */
const _genericAPIFunctionCallWrapper = (method, args) => {
    if (typeof brz[method] === 'function') {
        console.log(method + "() is not defined in " + brz.name);
        return brz[method](args);
    }
    else {
        throw new ReferenceError(method + "() is not defined in " + brz.name);
    }
};
/**
 * Function routes for Express to Breeze API
 *
 * Returns the response from breezeCHMS
 */
exports.getPeople = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_people", req.query || req.body), res);
exports.getEvents = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_events", req.query || req.body), res);
exports.getEvent = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_event", req.query || req.body), res);
exports.getCalendars = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_calendars", req.query || req.body), res);
exports.getEligible = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_event_eligible", req.query || req.body), res);
exports.getTags = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_tags", req.query || req.body), res);
exports.getFolders = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("get_folders", req.query || req.body), res);
exports.updateEventCheckIn = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("event_check_in", req.query || req.body), res);
exports.updateEventCheckOut = (req, res) => _APIHandler(_genericAPIFunctionCallWrapper("event_check_out", req.query || req.body), res);
/**
 * Generic get events instance call for Breeze API object
 * handles response
 */
const _genericGetEvents = req => {
    if ((req.query || req.body) === undefined
        || (req.query || req.body)['calendar'] === undefined
        || (req.query || req.body)['calendar'] === '') {
        throw new ReferenceError('A calendar `name` must be provided!');
    }
    return _genericAPIFunctionCallWrapper("get_calendars", req.query || req.body)
        .then(response => {
        return response
            .filter(x => x.name.toLowerCase() === (req.query || req.body)['calendar'].toLowerCase())
            .reduce((category_id, y) => y, []);
    })
        .then(data => {
        (req.query || req.body)['eligible'] = true;
        if (data.id !== undefined) {
            (req.query || req.body)['category_id'] = data.id;
        }
        if ((req.query || req.body) !== undefined
            && (req.query || req.body)['instance_id'] !== undefined
            && (req.query || req.body)['instance_id'] !== '') {
            return _genericAPIFunctionCallWrapper("get_event", req.query || req.body);
        }
        else {
            return _genericAPIFunctionCallWrapper("get_events", req.query || req.body);
        }
    });
};
/**
 * Generic get events instance call for Breeze API object
 * handles response
 */
const _genericGetEvent = req => {
    return _genericGetEvents(req)
        .then(response => {
        try {
            return response.filter(x => {
                return ((req.query || req.body)['start_date'] === undefined
                    || x.start_datetime.startsWith((req.query || req.body)['start_date']));
            });
        }
        catch (e) {
            return [response];
        }
    });
};
/**
 * Get User Image
 */
exports.getImage = req => {
    console.log("Get Breeze user image", req.query || req.body);
    return fls["get_image"](req.query || req.body);
};
/**
 * Event checkin
 */
exports.updateCheckIn = req => {
    console.log("Update Breeze check In");
    return _genericGetEvent(req)
        .then(data => {
        if (data.length > 1) {
            throw new ReferenceError('Too many event ids were returned!');
        }
        if (data[0].id !== undefined && (req.query || req.body)['instance_id'] === undefined) {
            (req.query || req.body)['instance_id'] = data[0].id;
        }
        console.log(req);
        _genericAPIFunctionCallWrapper("event_check_in", req.query || req.body);
    });
};
/**
 * Event checkout
 */
exports.updateCheckOut = req => {
    console.log("Update Breeze check Out");
    return _genericGetEvent(req)
        .then(data => {
        if (data.length > 1) {
            throw new ReferenceError('Too many event ids were returned!');
        }
        if (data[0].id !== undefined && (req.query || req.body)['instance_id'] === undefined) {
            (req.query || req.body)['instance_id'] = data[0].id;
        }
        console.log(req);
        _genericAPIFunctionCallWrapper("event_check_out", req.query || req.body);
    });
};
/**
 * List People with given criteria
 */
exports.listPeople = user => {
    console.log("List Breeze People");
    const params = {};
    // `1769999286` => email field ID
    if (user.email !== undefined && user.email !== '') {
        params['filter_json'] = { '1769999286': user.email };
    }
    else if (user.displayName !== undefined && user.displayName !== '') {
        // split display name in to first and last name search fields
        //190963912_first=<firstName>&190963912_last=<lastName>&190963912_nick=<nickName>
        let name;
        name = user.displayName.split(' ');
        if (name.length > 1) {
            params['filter_json'] = { '190963912_first': name[0],
                '190963912_last': name[1] };
        }
    }
    return _genericAPIFunctionCallWrapper("get_people", params);
};
/**
 * List People with given criteria
 */
exports.listEligible = (req, res) => {
    console.log("List Breeze People Eligible for given event");
    if ((req.query || req.body) === undefined) {
        throw new ReferenceError('A `req.query` or `req.body` must be provided!');
    }
    return _genericGetEvent(req)
        .then(data => {
        try {
            if (data.length > 1) {
                res.send(JSON.stringify(data));
            }
            else {
                (req.query || req.body)['eligible'] = true;
                (req.query || req.body)['filter_json'] = { 'tag_contains': '' };
                (req.query || req.body)['filter_json']['tag_contains'] = data
                    .reduce((tags, x) => x.eligible.tags, [])
                    .map(y => 'y_'.concat(y.id))
                    .join('-');
                exports.getPeople(req, res);
            }
        }
        catch (e) {
        }
    })
        .catch(error => {
        console.error(error);
        res.status(403).send(error);
    });
};
//# sourceMappingURL=lib.js.map