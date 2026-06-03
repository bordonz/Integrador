import 'dotenv/config';
import { Sequelize } from 'sequelize';
import pg from 'pg'

const sslConn = process.env.DB_SSL == 'true' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
} : undefined;

const sequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: sslConn,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.log('Unable to connect to the database:', error);
}

export default sequelize;