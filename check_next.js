const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('find /var/www/elektronova-site -maxdepth 3 -name "BUILD_ID"', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.on('close', () => {
      fs.writeFileSync('next_structure.txt', out);
      console.log('Structure checked');
      conn.end();
    });
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
