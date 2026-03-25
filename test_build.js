const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('Running npm run build...');
  conn.exec('cd /var/www/elektronova-site && npm run build', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', data => out += data.toString());
    stream.stderr.on('data', data => out += data.toString());
    stream.on('close', (code) => {
      fs.writeFileSync('build_output.txt', out + '\nEXIT CODE: ' + code);
      console.log('Build finished with code ' + code);
      conn.end();
    });
  });
}).connect({ host: '46.62.161.81', port: 22, username: 'root', password: 'endibossi123' });
