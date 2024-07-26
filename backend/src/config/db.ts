import knex from "knex";
import knexConfig from "../../knexfile";

const enivronment = process.env.ENVIRONMENT || "development";
const config = knexConfig[enivronment!];

const db = knex(config);

export default db;
