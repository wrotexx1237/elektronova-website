const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat ~/.pm2/logs/*error.log | tail -n 200', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data);
    stream.on('close', () => {
      fs.writeFileSync('pm2logs.txt', out);
      console.log('Logs written to pm2logs.txt');
      conn.end();
    });
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
