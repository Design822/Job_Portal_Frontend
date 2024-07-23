import knex from "knex";
import knexConfig from "../../knexfile";

const enivronment = process.env.ENVIRONMENT;
const config = knexConfig[enivronment!];

const db = knex(config);

export default db;
