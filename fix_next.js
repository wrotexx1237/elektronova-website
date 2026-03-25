const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('find /tmp /var/www -type d -name ".next" 2>/dev/null && ls -la /var/www/elektronova-site', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.on('close', () => {
      fs.writeFileSync('where_next.txt', out);
      console.log('Location logged.');
      conn.end();
    });
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
