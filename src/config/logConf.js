
const ClickHouseStream = require('@AcmeCryptoScope/clickHouseStream');

const ENVIRONMENT = process.env.NODE_ENV || 'test';
const config = require('./config.js')[ENVIRONMENT];


const clickHouseConfig = {
    connect: config.clickhouse,
    insert: `INSERT INTO ${config.clickHouseTable} FORMAT JSONEachRow`
};

const clickHouseStream = ClickHouseStream(clickHouseConfig);

module.exports = {
    projectName: 'logger-test',
    stream: {
        level: 'info',
        active: true,
        format: 'clickhouse',
        stream: clickHouseStream
    }
}