#!/bin/bash
set -e

echo "============================================"
echo "  ELEKTRONOVA - Server Setup (Ubuntu 22.04)"
echo "============================================"
echo ""

# 1. Update system
echo "[1/8] Duke përditësuar sistemin..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20
echo "[2/8] Duke instaluar Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
echo "[3/8] Duke instaluar PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# 4. Install Nginx, Git, Certbot
echo "[4/8] Duke instaluar Nginx, Git, Certbot..."
sudo apt install -y git nginx certbot python3-certbot-nginx

# 5. Install PM2
echo "[5/8] Duke instaluar PM2..."
sudo npm install -g pm2

# 6. Setup PostgreSQL database
echo "[6/8] Duke konfiguruar databazen..."
DB_PASS="Elektr0nova_$(openssl rand -hex 8)"
sudo -u postgres psql -c "CREATE USER elektronova WITH PASSWORD '${DB_PASS}';" 2>/dev/null || echo "User elektronova ekziston tashmë"
sudo -u postgres psql -c "CREATE DATABASE elektronova_db OWNER elektronova;" 2>/dev/null || echo "Database elektronova_db ekziston tashmë"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE elektronova_db TO elektronova;"
sudo -u postgres psql -d elektronova_db -c "GRANT ALL ON SCHEMA public TO elektronova;"

# 7. Clone project
echo "[7/8] Duke klonuar projektin nga GitHub..."
sudo mkdir -p /var/www
cd /var/www
if [ -d "elektronova" ]; then
    echo "Folder elektronova ekziston, duke bërë pull..."
    cd elektronova
    git pull origin main
else
    git clone https://github.com/wrotexx1237/elektronova-asset-manager.git elektronova
    cd elektronova
fi

# 8. Create .env file
echo "[8/8] Duke konfiguruar environment..."
cat > .env << EOF
DATABASE_URL=postgresql://elektronova:${DB_PASS}@localhost:5432/elektronova_db
NODE_ENV=production
PORT=5000
EOF

# Install dependencies and build
echo ""
echo "Duke instaluar dependencies..."
npm install

echo "Duke bërë build..."
npm run build

echo "Duke sinkronizuar databazen..."
npx drizzle-kit push

# Start with PM2
echo "Duke startuar aplikacionin..."
pm2 delete elektronova 2>/dev/null || true
pm2 start dist/index.cjs --name elektronova --env production
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || pm2 startup

# Setup Nginx
echo "Duke konfiguruar Nginx..."
sudo tee /etc/nginx/sites-available/elektronova > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/elektronova /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
sudo systemctl enable nginx

# Create autodeploy script
echo "Duke krijuar skriptën e autodeploy..."
cat > /var/www/elektronova/deploy.sh << 'DEPLOY'
#!/bin/bash
set -e
cd /var/www/elektronova
echo "$(date): Duke filluar deploy..."
git pull origin main
npm install
npm run build
npx drizzle-kit push
pm2 restart elektronova
echo "$(date): Deploy u kompletua me sukses!"
DEPLOY
chmod +x /var/www/elektronova/deploy.sh

echo ""
echo "============================================"
echo "  INSTALIMI U KOMPLETUA ME SUKSES!"
echo "============================================"
echo ""
echo "  Aplikacioni: http://$(curl -s ifconfig.me):80"
echo "  Database password: ${DB_PASS}"
echo "  Projekt path: /var/www/elektronova"
echo "  Autodeploy: /var/www/elektronova/deploy.sh"
echo ""
echo "  RUAJE KETE PASSWORD! Nuk do tregohet më."
echo ""
echo "  Për SSL (nëse ke domain):"
echo "  sudo certbot --nginx -d domain-yt.com"
echo ""
echo "  Për autodeploy manual:"
echo "  bash /var/www/elektronova/deploy.sh"
echo ""
echo "============================================"
