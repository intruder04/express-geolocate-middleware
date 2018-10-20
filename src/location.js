// @flow
/* eslint class-methods-use-this: 0 */

import type {
    $Request
} from 'express';

const MMDBReader = require('mmdb-reader');
const fs = require('fs');
const path = require('path');
const useragent = require('useragent');
const torDetect = require('tor-detect');
const dbUpdater = require('./libs/updater');

const config = require('./config/config');

const isObject = (obj: Object): boolean => obj === Object(obj);

const getHostName = (url: string): (string | null) => {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    }
    return null;
}

class Ip2Geo {
    reader: any

    checkDbUpdate: boolean

    dbPath: string

    language: string

    // init and load location db in memory
    constructor(options: Object) {
        this.checkOptions(options);
        const {
            checkDbUpdate = false, language = 'en'
        } = options;
        this.reader = null;
        this.checkDbUpdate = checkDbUpdate;
        this.dbPath = path.join(__dirname, '..', config.mmdb.localPath, config.mmdb.localName);
        this.language = language;
    }

    async initialize(): Promise<any> {
        if (this.checkDbUpdate && this.reader === null) {
            await dbUpdater.update();
        }

        if (fs.existsSync(this.dbPath)) {
            this.reader = new MMDBReader(this.dbPath);
        } else {
            throw new Error('DB file does not exist');
        }
    }

    checkOptions(options: Object) {
        if (!isObject(options)) {
            throw new TypeError('Please provide options object');
        }
    }

    // load custom location database in memory
    initLocDb(dbPath: string): any {
        if (fs.existsSync(dbPath)) {
            const customReader = new MMDBReader(dbPath);
            this.reader = customReader;
        } else {
            throw new Error('Custom DB file does not exist');
        }
    }

    async getReader(): any {
        if (this.reader === null) {
            // console.log('in getReader', this);
            await this.initialize();
        }
    }

    // get full mmdb-reader location object. Null if not found
    async lookupLocation(ip: string): Object {
        await this.getReader(); // load db
        return this.reader.lookup(ip);
    }

    parseLocationData(loc: Object, language: string): Object {
        const result = {};
        if (loc !== null) {
            result.ip = loc.ip ? loc.ip : null;
            result.city = loc.city ? loc.city.names[language] : null;
            result.continent = loc.continent ? loc.continent.names[language] : null;
            result.country_iso = loc.country ? loc.country.iso_code : null;
            result.latitude = loc.location ? `${loc.location.latitude}` : null;
            result.longitude = loc.location ? `${loc.location.longitude}` : null;
            result.postal_code = loc.postal ? loc.postal.code : null;
            result.state = loc.subdivisions[0] ? loc.subdivisions[0].names[language] : null;
        }

        return result;
    }

    // main method
    async locate(ip: string): Object {
        const loc = await this.lookupLocation(ip);
        const parsedLoc = this.parseLocationData(loc, this.language);
        parsedLoc.ip = ip;
        return parsedLoc;
    }

    async exprMiddleware(req: $Request): Object {
        try {
            let remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            if (remoteIp.substr(0, 7) === "::ffff:") {
                remoteIp = remoteIp.substr(7)
            }

            // remoteIp = '89.189.10.242'; // default for tests

            const visit = await this.locate(remoteIp);
            visit.path = req.originalUrl;
            visit.domain = req.get('host');
            visit.method = req.method;
            visit.params = JSON.stringify(req.params);
            visit.query = JSON.stringify(req.query);
            visit.cookie = JSON.stringify(req.cookies);
            visit.referrer = req.headers.referrer || req.headers.referer;

            if (visit.referrer) {
                visit.referrerDomain = getHostName(visit.referrer);
            }

            if (req.query.refId) {
                visit.refId = req.query.refId;
            }

            if (req.query.subId) {
                visit.subId = req.query.subId;
            }

            // check if ip is note exit node
            const isTor = await torDetect(remoteIp);
            visit.isTor = isTor;

            // session stuff
            if ((req: Object).session) {
                if ((req: Object).session.uuid) {
                    visit.sessionId = (req: Object).session.uuid;
                }
            }

            if ((req: Object).uuidAction) {
                visit.uuidAction = (req: Object).uuidAction;
            }

            // user agent stuff
            const userAgent = req.get('User-Agent');
            const userAgentParsed = useragent.parse(userAgent);

            visit.userAgent = userAgent;
            visit.browser = userAgentParsed.family;
            visit.browserVersion = userAgentParsed.toVersion();
            visit.device = userAgentParsed.device.family;
            visit.deviceVersion = userAgentParsed.device.toVersion();
            visit.os = userAgentParsed.os.family;
            visit.osVersion = userAgentParsed.os.toVersion();

            return visit;
        } catch (error) {
            throw new Error(`Something wrong in exprMiddleware: ${error}`);
        }
    }

}

module.exports = Ip2Geo;