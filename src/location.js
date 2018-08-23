// @flow
/* eslint class-methods-use-this: 0 */
import type { $Request } from 'express';

const MMDBReader = require('mmdb-reader');
const fs = require('fs');
const dbUpdater = require('./libs/updater');

const isObject = (obj: Object): boolean => obj === Object(obj);

class Ip2Geo {
    reader: any

    checkDbUpdate: boolean

    dbPath: string

    language: string

    // init and load location db in memory
    constructor(options: Object) {
        this.checkOptions(options);
        const { checkDbUpdate = false, language = 'en' } = options;
        this.reader = null;
        this.checkDbUpdate = checkDbUpdate;
        this.dbPath = './geo_db/GeoLite2-City.mmdb';
        this.language = language;
    }

    async initialize(): Promise<any> {
        console.log('in initialize method!');
        if (this.checkDbUpdate && this.reader === null) {   
            console.log('calling updater!');       
            await dbUpdater.update();
        }
        
        if (fs.existsSync(this.dbPath)) {
            this.reader = new MMDBReader(this.dbPath);
        } else {
            throw new Error('DB file does not exist');
        }
    }

    checkOptions (options: Object) {
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
        await this.getReader();   // load db
        return this.reader.lookup(ip);
    }

    parseLocationData(loc: Object, language: string): Object {
        const result = {};
        if(loc !== null) {
            result.ip = loc.ip ? loc.ip : null;
            result.city = loc.city ? loc.city.names[language] : null;
            result.continent = loc.continent ? loc.continent.names[language] : null;
            result.country_iso = loc.country ? loc.country.iso_code : null;
            result.latitude = loc.location ? `${loc.location.latitude}` : null;
            result.longitude = loc.location ? `${loc.location.longitude}` : null;
            result.postal_code = loc.postal ? loc.postal.code : null;
        } else {
            result.error = 'Location not found';
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
            const userAgent = req.get('User-Agent');
            const path = req.originalUrl;
            const domain = req.get('host');
            // const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
            const ip = '89.189.10.242'; // default for tests
    
            const location = await this.locate(ip);
            location.userAgent = userAgent;
            location.path = path;
            location.domain = domain;
            return location;
        } catch (error) {
            throw new Error(`Something wrong in exprMiddleware: ${error}`);
        }
    }

}

module.exports = Ip2Geo;

