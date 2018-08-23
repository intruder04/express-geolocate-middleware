module.exports = {
    test: {
        mmdb: {
            localName: 'GeoLite2-City.mmdb',
            localPath: './geo_db',
            remote: 'https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz'
            },
        clickHouseTable: 'location',
        clickhouse: {
            host: process.env.CH_HOST || '0.0.0.0',
            port: process.env.CH_PORT || '8123'
        }
    }
}