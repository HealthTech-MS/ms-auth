import { Sequelize } from "sequelize";

const db = new Sequelize("misalud","misalud_user","oIO9Krncmn8pz2UQBW12WPFfL0tHnD8Q", {
    dialect: "postgres",
    host: "dpg-coq2nkcf7o1s73e9tp5g-a.oregon-postgres.render.com",
    dialectOptions: {
        ssl: true
    }
});

export default db;