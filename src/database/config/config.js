// Configuração usada pelo sequelize-cli (migrations e seeders).
// Lê as mesmas variáveis de ambiente da aplicação, então funciona tanto
// localmente (.env) quanto dentro do container (variáveis do docker-compose).
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const base = {
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || null,
  database: process.env.MYSQL_DATABASE || 'expenses',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  dialect: 'mysql',
  // Azure Database for MySQL exige TLS: defina MYSQL_SSL=true para conectar nele
  dialectOptions: process.env.MYSQL_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {},
  // Registra os seeders executados para não duplicar dados a cada restart do container
  seederStorage: 'sequelize',
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
