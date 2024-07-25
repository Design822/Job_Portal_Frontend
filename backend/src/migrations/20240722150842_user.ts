import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary().unique();
    table.string("first_name");
    table.string("last_name");
    table.string("phone");
    table.string("email");
    table.string("image");
    table.string("password");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
