const ClickHouse = require('@apla/clickhouse');

const config = require("../../build/config/config");

const clickHouse = new ClickHouse({
    host: config.clickhouseTest.host,
    port: config.clickhouseTest.port
});

clickHouse.query(`CREATE TABLE IF NOT EXISTS ${config.clickHouseTableTest} (
    projectName String,
    level String,
    error String,
    time DateTime,
    line UInt32,
    file String,
    city String,
    continent String,
    country_iso String,
    latitude String,
    longitude String,
    postal_code String,
    userAgent String,
    ip String,
    uuid String,
    domain String,
    path String
    ) ENGINE = Log`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table has been created');
    }
});


clickHouse.query(`CREATE TABLE IF NOT EXISTS sentry (
    projectName String,
    name String,
    errorType String,
    level String,
    error String,
    eventID String,
    issueID String,
    message String,
    browser String,
    stack String,
    code UInt32,
    method String,
    host String,
    url String,
    token String,
    authorization String,
    connection String,
    clientIp String,
    date Date,
    dateReceived DateTime,
    dateCreated DateTime,
    time DateTime,
    file String,
    line UInt32,
    stackLine UInt32,
    stackFunction String,
    stackFilename String
    ) ENGINE = Log`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table has been created');
    }

});

clickHouse.query(`CREATE TABLE IF NOT EXISTS error_statistic
(
   projectName String,
   errorType String,
   name String,
   level String,
   message String,
   stack String,
   error String,
   details String,
   body String,
   data String,
   response String,
   status UInt32,
   keyword String,
   dataPath String,
   code UInt32,
   signal String,
   method String,
   url String,
   host String,
   accept_encoding String,
   user_agent String,
   token String,
   authorization String,
   content_type String,
   content_length String,
   connection String,
   msg String,
   time DateTime,
   file String,
   line UInt32
) ENGINE = Log`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table log has been created');
    }
});

clickHouse.query(`CREATE TABLE IF NOT EXISTS info_statistic
(
   projectName String,
   errorType String,
   name String,
   level String,
   message String,
   stack String,
   error String,
   details String,
   body String,
   data String,
   response String,
   status UInt32,
   keyword String,
   dataPath String,
   code UInt32,
   signal String,
   method String,
   url String,
   host String,
   accept_encoding String,
   user_agent String,
   token String,
   authorization String,
   content_type String,
   content_length String,
   connection String,
   msg String,
   time DateTime,
   file String,
   line UInt32
) ENGINE = Log`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table log has been created');
    }
});

// clickHouse.query(`SELECT * FROM ${config.clickHouseTableTest}`, (err, res) => {
//     if (err) console.error(err);
//     console.log('Result: ', res);
// });

// clickHouse.query(`SELECT * FROM sentry`, (err, res) => {
//     if (err) console.error(err);
//     console.log('Result: ', res);
// });

// clickHouse.query(`SELECT * FROM error_statistic`, (err, res) => {
//     if (err) console.error(err);
//     console.log('Result: ', res);
// });

const stream = clickHouse.query("SELECT if(empty(errorType), 'Undefined', errorType), count() FROM sentry where projectName = 'statistics' group by errorType");
const rows = [];

stream.on('data', (row) => {
    // console.log('row in stream - ',row);
    rows.push(row);
});

stream.on('error', (err) => {
    console.log(err);
});

stream.on('end', () => {
    console.log('rows - ', rows);
});


// const myObj = {projectName:"statistics-boilerplate",level:"info",ip:"89.189.10.242",city:"Nizhniy Novgorod",continent:"Europe",country_iso:"RU",latitude:"56.3269",longitude:"44.0075",postal_code:"603163",userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",path:"/",domain:"localhost:3000",time:"2018-08-27T13:28:44.544Z",file:"",line:0};

// const start = `CREATE TABLE IF NOT EXISTS ${config.clickHouseTableTest} (
//     projectName String,
//     level String,
//     error String,
//     time String,
//     line UInt32,
//     file String,
//     city String,
//     continent String,
//     country_iso String,
//     latitude String,
//     longitude String,
//     postal_code String,
//     userAgent String,
//     ip String,
//     domain String,
//     path String
//     ) ENGINE = Log`;

// clickHouse.querying(start)
//     .then(() => {
//         const stream = clickHouse.query('INSERT INTO location FORMAT JSONEachRow');
//         console.log('Stream: ', stream);
//         return stream;
//     })
//     .then((stream) => {
//         const result = stream.write(JSON.stringify(myObj));
//         stream.end();
//         console.log('result: ', result)

//     })
//     .catch(err => {
//         console.error(err);
// });