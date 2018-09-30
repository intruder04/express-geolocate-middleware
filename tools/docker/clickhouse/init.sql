CREATE TABLE IF NOT EXISTS visits (
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
    browser String,
    browserVersion String,
    device String,
    deviceVersion String,
    os String,
    osVersion String,
    sessionId String,
    uuidAction String,
    ip String,
    domain String,
    path String
    ) ENGINE MergeTree() PARTITION BY toYYYYMM(time) ORDER BY (time)