const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/elektronova-site && npm run start', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.stderr.on('data', data => out += data.toString());

    // Wait 4 seconds to collect output before terminating
    setTimeout(() => {
      fs.writeFileSync('start_crash.txt', out);
      conn.end();
    }, 4000);
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
