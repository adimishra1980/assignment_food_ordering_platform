export function up(knex) {
  return knex.schema.createTable('menu_items', (table) => {
    table.increments('id').primary();  // we can have here uuid if needed 
    table.string('name').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('image_url');
    table.string('category').notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable('menu_items');
}