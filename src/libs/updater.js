
const fs = require('fs');
const https = require('https');
const zlib = require('zlib');
const path = require('path');
const { URL } = require('url');

const ENVIRONMENT = process.env.NODE_ENV || 'test';
const config = require('../config/config')[ENVIRONMENT];

// console.log(`Running update script with config: ${JSON.stringify(config)}`)

const checkUpdate = (remote, local): any => {
  // console.log('local', local);
  
  return new Promise((resolve, reject): Promise<boolean> => {
    let stats = null;
    // check if there is db file and get mod time
    if (fs.existsSync(local)) {
      stats = fs.statSync(local);
    // no file - need to update
    } else {
      console.log('no file found - downloading');
      return resolve(true);
    }

    const url = new URL(remote);
    const options = {
      host: url.hostname,
      path: url.pathname,
      headers: {
        'If-Modified-Since': stats.mtime.toUTCString()
        // 'If-Modified-Since': 'Tue, 14 Mar 2018 12:15:17 GMT'
      }
    };

    // console.log(options);

    https.get(options, (response): boolean => {
      // console.log('code', response.statusCode);
      if (response.statusCode === 304) {
          console.log('Not modified!');
          resolve(false);
      } else {
        console.log('Modified!');
        resolve(true);
      }
      
    });
  });
}

const download = (url, dest): any => {
  return new Promise((resolve: any, reject: any) => {
      const file = fs.createWriteStream(dest, { flags: "wx" });
      const request = https.get(url, response => {
          if (response.statusCode === 200) {
              response.pipe(zlib.createGunzip())  // unzip db file
              .pipe(file)
          } else {
              file.close();
              fs.unlink(dest, () => {}); // Delete temp file
              reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
          }
      });

      request.on("error", err => {
          file.close();
          fs.unlink(dest, () => {}); // Delete temp file
          reject(err.message);
      });

      file.on("finish", () => {
          resolve();
      });

      file.on("error", err => {
          file.close();

          if (err.code === "EEXIST") {
              reject(new Error("File already exists"));
          } else {
              fs.unlink(dest, () => {}); // Delete temp file
              reject(err.message);
          }
      });
  });
}

const update = async () => {
  console.log('in updater!');
  
  const localPath = path.join(config.mmdb.localPath, config.mmdb.localName);
  const needToUpdate = await checkUpdate(config.mmdb.remote, localPath);

  if (needToUpdate) {
    console.log('removing local file and downloading a new one');
    fs.unlink(localPath, () => {});
    await download(config.mmdb.remote, localPath);
  }
}

module.exports.update = update;
