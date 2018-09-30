const ClickHouseStream = require('@AcmeCryptoScope/clickHouseStream');

const config = require('./config.js');


const clickHouseConfig = {
    connect: config.clickhouseTest,
    insert: `INSERT INTO ${config.clickHouseTableTest} FORMAT JSONEachRow`
};

const clickHouseStream = ClickHouseStream(clickHouseConfig);

module.exports = {
    projectName: config.loggerProjectName,
    stream: {
        level: 'info',
        active: true,
        format: 'clickhouse',
        stream: clickHouseStream
    }
}