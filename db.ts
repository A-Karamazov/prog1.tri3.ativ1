import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");
const query = db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        username        TEXT NOT NULL UNIQUE,
        email           TEXT NOT NULL UNIQUE,
        password_hash   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lista_exercicios (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        nome            VARCHAR, 
        descricao       VARCHAR,
        grupoMuscular   VARCHAR,
        tipo            VARCHAR
`);
query.run();

export { db }
