import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("jobs", (table) => {
    table.increments("id").unique().primary();
    table.string("company_address");
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('jobs');
}
