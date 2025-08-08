import { jsonRpcErrorResponse } from "../utils/jsonRpcResponse.js";

export const placeOrder = async (db, { customer, items }) => {
  // Use a transaction to ensure all database operations succeed or fail together.

  const newOrderId = await db.transaction(async (trx) => {
    // 1. Calculate the total amount on the server-side for security.
    const itemIds = items.map((item) => item.id);
    const menuItems = await trx("menu_items").whereIn("id", itemIds);

    const totalAmount = items.reduce((total, cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id); // here we are matching the cartItem which is id to the menuItems so that we can get all the details about the menu like price, quantity etc
      if (!menuItem)
        throw new Error(`Menu item with id ${cartItem.id} not found.`);
      return total + parseFloat(menuItem.price) * cartItem.quantity;
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

    return orderId;
  });

  return { orderId: newOrderId };
};

export const listOrders = async (db, params) => {
  let query = db("orders").select("*");

  if (params?.status) {
    query = query.where("status", params.status);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const orders = await query.orderBy("created_at", "asc");

  if (orders.length === 0) {
    return [];
  }

  // get all the ids of the orders
  const orderIds = orders.map((order) => order.id);

  // Fetch all order items that belong to those orders in a single, efficient query.
  // We also join with menu_items to get the name for each item.

  const orderItems = await db("order_items")
    .join("menu_items", "order_items.menu_item_id", "=", "menu_items.id")
    .select(
      "order_items.order_id",
      "order_items.quantity",
      "menu_items.name",
      "menu_items.id as menu_item_id"
    )
    .whereIn("order_items.order_id", orderIds);

  // Step 4: Map the items back to their corresponding orders using fast in-memory code.
  const ordersWithItems = orders.map((order) => {
    return {
      ...order,
      items: orderItems.filter((item) => item.order_id === order.id),
    };
  });

  return ordersWithItems;
};

async function getOrderWithItems(orderId, trx = db) {
  if (!orderId) return null;

  const order = await trx("orders").where({ id: orderId }).first();
  if (!order) return null;

  const items = await trx("order_items")
    .join("menu_items", "order_items.menu_item_id", "=", "menu_items.id")
    .select("order_items.*", "menu_items.name")
    .where({ order_id: orderId });

  return { ...order, items };
}

export const acceptOrder = async (db, { orderId }) => {
  const [updatedOrder] = await db("orders")
    .where("id", orderId)
    .update({ status: "ACCEPTED" })
    .returning("*");

  if (!updatedOrder) {
    throw new Error(`Order #${orderId} not found or cannot be accepted.`);
  }

  console.log("order accepted", updatedOrder);

   // After updating, fetch the full order with its items
  return getOrderWithItems(updatedOrder.id, db);
};

export const updatedOrderStatus = async (db, { orderId, status }) => {
  const [updatedOrder] = await db("orders")
    .where("id", orderId)
    .update({ status: status })
    .returning("*");

  if (!updatedOrder) {
    throw new Error(`Order #${orderId} not found.`);
  }
  console.log("order updated", updatedOrder);

  return getOrderWithItems(updatedOrder.id, db);
};
