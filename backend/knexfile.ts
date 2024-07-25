import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "job_portal",
      user: "pg",
      password: "976747",
      port: 5432,
    },

    migrations: {
      directory: "./src/migrations",
    },
  },
};

export default config;
