import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("apply", (table) => {
    table
      .enum("view", ["accepted", "rejected", "pending"])
      .defaultTo("pending");
    table.integer("job_id").unsigned();
    table.integer("user_id").unsigned();
    table
      .foreign("job_id")
      .references("id")
      .inTable("addJob")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("user_id")
      .references("id")
      .inTable("job_seeker")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("apply");
}
