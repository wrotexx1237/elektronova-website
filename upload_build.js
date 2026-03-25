const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

console.log('Starting SSH connection for pre-compiled build transfer...');
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading next_build.zip...');
    const remotePath = '/var/www/elektronova-site/next_build.zip';
    sftp.fastPut(path.join(__dirname, 'next_build.zip'), remotePath, (err) => {
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
