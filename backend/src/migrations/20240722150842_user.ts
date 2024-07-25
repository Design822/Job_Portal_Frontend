import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("company", (table) => {
    table.increments("id").primary().unique();
    table.string("name_of_company");
    table.string("phone");
    table.string("company_email");
    table.string("company_address");
    table.string("image");
    table.string("password");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("company");
}
