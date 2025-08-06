/**
 * Places a new order by creating records in the 'orders' and 'order_items' tables.
 * @param {import('knex').Knex} db - The Knex database instance.
 * @param {Object} params - The parameters for placing an order.
 * @param {Object} params.customer - Customer details.
 * @param {Array<Object>} params.items - The items in the order.
 * @returns {Promise<Object>} A promise that resolves to an object containing the new order ID.
 */

export const placeOrder = async (db, { customer, items }) => {
  // Use a transaction to ensure all database operations succeed or fail together.
  const newOrderId = await db.transaction(async (trx) => {
    // 1. Calculate the total amount on the server-side for security.
    const itemIds = items.map((item) => item.id);
    const menuItems = await trx("menu_items").whereIn("id", itemIds);

    const totalAmount = items.reduce((total, cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id); // here we are matching the cartItem which is id to the menuItems so that we can get all the details about the menu like price, qty etc
      if (!menuItem)
        throw new Error(`Menu item with id ${cartItem.id} not found.`);
      return total + parseFloat(menuItem.price) * cartItem.qty;
    }, 0);

    // 2. Insert into the 'orders' table.
    const [newOrder] = await trx("orders")
      .insert({
        customer_name: customer.name,
        customer_phone: customer.phone,
        total_amount: totalAmount,
        status: "PENDING",
      })
      .returning("id");

    const orderId = newOrder.id;

    // 3. Prepare the 'order_items' data.
    const orderItemsToInsert = items.map((cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id);
      return {
        order_id: orderId,
        menu_item_id: cartItem.id,
        quantity: cartItem.quantity,
        price: menuItem.price,
      };
    });

    // 4. Insert into the 'order_items' table.
    await trx("order_items").insert(orderItemsToInsert);

    return orderId
  });

  return {orderId: newOrderId}
};
