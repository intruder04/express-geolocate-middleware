## DEPENDENCES
 - node v8+

## USAGE
```bash
const IpGeo = require('build/index.js');
const geo = new IpGeo({ checkDbUpdate: true, language: 'en' });

const geoMiddleware = async (req, res, next) => {
  try {
    const loc = await geo.exprMiddleware(req);
  } catch (error) {
    next(error);
  }
};

app.use(geoMiddleware);
```

# loc example:
```
{ ip: '89.189.10.242',
  city: 'Nizhniy Novgorod',
  continent: 'Europe',
  country_iso: 'RU',
  latitude: '56.3269',
  longitude: '44.0075',
  postal_code: '603092',
  state: 'Nizhny Novgorod Oblast',
  path: '/statistic',
  domain: 'localhost:3000',
  method: 'GET',
  params: '{}',
  query: '{}',
  cookie: '{"_csrf":"19beb80eefba030eaf1adb95b63925d2377437df2826f9b803b243519c49b034a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22%D8%B5%98%81%B3%F3%F2%A4mJ%0Fw%C4%D8%18%2B%3AV%0EZ%99%FF%A3%E8%FE%92%06w%97%A2%13%BB%22%3B%7D","io":"QEzikMRrZ_W4I_gbAAAG"}',
  referrer: undefined,
  isTor: false,
  sessionId: 'aa0124a3-8283-455a-b53f-9ad56b53d6fc',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
  browser: 'Chrome',
  browserVersion: '69.0.3497',
  device: 'Other',
  deviceVersion: '0.0.0',
  os: 'Mac OS X',
  osVersion: '10.13.6' }

```


## CLICKHOUSE TABLE (logger)
Table creation script is located in tools\db\visits.sql
