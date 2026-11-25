const { Sequelize, Model } = require('sequelize');

require('dotenv').config();

let logCount = 1

function countLog(msg){
    console.log(`${logCount}) ${msg}`);
    logCount++;
}

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env. MYSQL_PORT,
    dialect: 'mysql',
    // Azure Database for MySQL exige TLS: defina MYSQL_SSL=true para conectar nele
    dialectOptions: process.env.MYSQL_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {},
    logging: (msg) => countLog(msg)
})

module.exports = { sequelize };