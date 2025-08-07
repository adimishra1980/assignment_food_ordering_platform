/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("orders", (table) => {
      table.increments("id").primary();
      table.string("customer_name").notNullable();
      table.string("customer_phone").notNullable();
      table.decimal("total_amount", 10, 2).notNullable();
      table.string("status").notNullable().defaultTo("PENDING");
      table.string("payment_ref");
      table.timestamps(true, true);

      // Add a check constraint for the status flow as per the assignment [cite: 69]
      table.check(
        `status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'PAID')`
      );
    })
    .createTable("order_items", (table) => {
      table.increments("id").primary();
      table
        .integer("order_id")
        .unsigned()
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");
      table
        .integer("menu_item_id")
        .unsigned()
        .references("id")
        .inTable("menu_items");
      table.integer("quantity").notNullable();
      table.decimal("price", 10, 2).notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  // Drop tables in reverse order of creation
  return knex.schema
    .dropTableIfExists("order_items")
    .dropTableIfExists("orders");
}
