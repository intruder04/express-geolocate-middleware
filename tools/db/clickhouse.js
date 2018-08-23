const ClickHouse = require('@apla/clickhouse');

const ENVIRONMENT = process.env.NODE_ENV || "test";
const config = require("../../build/config/config")[ENVIRONMENT];

const clickHouse = new ClickHouse({host: config.clickhouse.host, port: config.clickhouse.port});

clickHouse.query(`CREATE TABLE IF NOT EXISTS ${config.clickHouseTable} (
    projectName String,
    level String,
    error String,
    time String,
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
    domain String,
    path String
    ) ENGINE = Log`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table has been created');
    }
});


clickHouse.query(`SELECT * FROM ${config.clickHouseTable}`, (err, res) => {
    if (err) console.error(err);
    console.log('Result: ', res);
});

// const stream = clickHouse.query(`SELECT * FROM ${config.clickHouseTable}`);
// const rows = [];

// stream.on ('data', (row) => {
//     // console.log('row in stream - ',row);
//     rows.push(row);
// });

// stream.on ('error', (err) => {
//   console.log(err);
// });

// stream.on ('end', () => {
//     console.log('rows - ',rows);
// });
