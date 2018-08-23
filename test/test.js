const express = require('express');
const Logger = require('@AcmeCryptoScope/logger');
const loggerConf = require('../build/config/logConf');
const Ip2Geo = require('../build/location');

const app = express();

const geo = new Ip2Geo({ checkDbUpdate: true, language: 'en' });
const logger = new Logger(loggerConf);

const geoMiddleware = async (req, res, next) => {
    try {
        const loc = await geo.exprMiddleware(req);
        console.log(loc);
        logger.info({ loc });
        next();
    } catch (error) {
        next(error);
    }
}

app.use(geoMiddleware);

// app.get('*', async (req, res, next) => {    
//     res.send('Hello World!');
// });

app.listen(3001, () => console.log('Example app listening on port 3001!'));





// // random ip test

// // const limit = 1000;
// // console.time('prepare');
// // const ipArray = [];
// // for (let index = 0; index < limit; index++) {
// //     const ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0);
// //     ipArray.push(ip);
    
// // }

// // console.timeEnd('prepare');

// // async function main() {
// //     console.time('test');
// //     for (const ip of ipArray) {
// //       const location = await findLocation(ip);
// //     }
// //     console.timeEnd('test');

// //     const used = process.memoryUsage();
// //     for (let key in used) {
// //     console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// //     }

// //     logger.closeStreams();
// //   }

// // main();







