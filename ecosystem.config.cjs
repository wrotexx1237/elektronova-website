module.exports = {
  apps: [{
    name: "elektronova-api",
    cwd: "/var/www/elektronova/Asset-Manager",
    script: "node",
    args: "dist/index.cjs",
    env: {
      NODE_ENV: "production",
      PORT: "5000",
      DATABASE_URL: "postgresql://elektronova_user:ElektroNova%402024%21@localhost:5432/elektronova_db",
      SESSION_SECRET: "elektronova-session-secret-2024",
      JWT_SECRET: "elektronova-jwt-secret-2024"
    }
  }]
}
