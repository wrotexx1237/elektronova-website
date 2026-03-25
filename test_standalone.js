const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/elektronova-site && PORT=5000 node server.js', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.stderr.on('data', data => out += data.toString());
    setTimeout(() => {
      fs.writeFileSync('standalone_crash.txt', out);
      console.log('Crash collected');
      conn.end();
    }, 4000);
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
