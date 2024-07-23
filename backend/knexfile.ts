import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABSE_USER,
      password: process.env.DATABASE_PASSWORD,
    },

    migrations: {
      directory: "./src/migrations",
    },
  },
};

export default config;
