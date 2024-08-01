import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("addJob", (table) => {
    table.increments("id").primary().unique();
    table.string("title");
    table.string("position");
    table.string("no_of_vacancies");
    table.string("salary");
    table.enum("time", ["fulltime", "parttime", "contract"]);
    table.date("starting_date");
    table.date("ending_date");
    table.enum("gender", ["male", "female", "other", "both"]);
    table.string("education_required");
    table.string("job_summary");
    table.string("job_description");
    table.string("skills");
    table.boolean("verify").defaultTo(false);
    table.integer("category_id").unsigned();
    table.integer("company_id").unsigned();
    table
      .foreign("category_id")
      .references("id")
      .inTable("category")
      .onUpdate("CASCADE");
    table
      .foreign("company_id")
      .references("id")
      .inTable("company")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("addJob");
}
