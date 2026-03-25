const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('netstat -tlnp && cat /var/www/elektronova-site/package.json', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.on('close', () => {
      fs.writeFileSync('netstat.txt', out);
      conn.end();
    });
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
