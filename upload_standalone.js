const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  console.log('Uploading standalone.zip...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(path.join(__dirname, 'standalone.zip'), '/var/www/elektronova-site/standalone.zip', (err) => {
      if (err) throw err;
      console.log('Upload successful!');
      conn.end();
    });
  });
}).on('error', err => console.error(err)).connect({
  host: '46.62.161.81',
  port: 22,
  username: 'root',
  password: 'endibossi123'
});
