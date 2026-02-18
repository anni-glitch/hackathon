const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'nyaysetu_db',
    process.env.DB_USER || 'nyay_user',
    process.env.DB_PASS || 'nyay_password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Disable SQL logging
    }
);

module.exports = sequelize;
