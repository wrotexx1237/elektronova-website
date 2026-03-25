const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

console.log('Starting SSH connection...');
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP session started. Uploading update.zip...');
    const remotePath = '/var/www/elektronova-site/update.zip';
    sftp.fastPut(path.join(__dirname, 'update.zip'), remotePath, (err) => {
      if (err) throw err;
      console.log('Upload successful!');
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '46.62.161.81',
  port: 22,
  username: 'root',
  password: 'endibossi123'
});
