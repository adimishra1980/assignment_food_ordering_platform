
/**
 * Fetches all menu items from the database.
 * @param {import('knex').Knex} db - The Knex database instance.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of menu items.
 */
export const getMenu = async (db) => {
  return db('menu_items').select('*');
};