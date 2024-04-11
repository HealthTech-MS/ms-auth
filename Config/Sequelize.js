import { Sequelize } from "sequelize";

const db = new Sequelize("misalud","root","", {
    dialect: "mysql",
    host: "localhost"
});

export default db;