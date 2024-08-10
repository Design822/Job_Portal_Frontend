import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("admin", (table) => {
    table.increments("id").primary().unique();
    table.string("email");
    table.string("password");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("admin");
}
