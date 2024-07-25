import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("category", (table) => {
    table.increments("id").unique().primary();
    table.string("category_name");
    table.boolean("accepted").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("category");
}
