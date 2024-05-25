import pg from "pg"
import dontenv from 'dotenv'
import { Sequelize } from "sequelize";

dontenv.config()

const db = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    dialectModule: pg,
    dialectOptions: {
        ssl: true
    }
});

export default db;