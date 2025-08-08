import { jsonRpcErrorResponse } from "../utils/jsonRpcResponse.js";

async function getOrderWithItems(orderId, trx = db) {
  const order = await trx("orders").where({ id: orderId }).first();
  if (!order) return {};

  const items = await trx("order_items")
    .join("menu_items", "order_items.menu_item_id", "=", "menu_items.id")
    .select(
      "order_items.order_id",
      "menu_items.name",
      "order_items.quantity",
      "order_items.menu_item_id"
    )
    .where({ order_id: orderId });

  return { ...order, items };
}

export const placeOrder = async (db, { customer, items }) => {
  const newOrderId = await db.transaction(async (trx) => {
    const itemIds = items.map((item) => item.id);
    const menuItems = await trx("menu_items").whereIn("id", itemIds);

    const totalAmount = items.reduce((total, cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id);
      if (!menuItem)
        throw new Error(`Menu item with id ${cartItem.id} not found.`);
      return total + parseFloat(menuItem.price) * cartItem.quantity;
    }, 0);

    const [newOrder] = await trx("orders")
      .insert({
        customer_name: customer.name,
        customer_phone: customer.phone,
        total_amount: totalAmount,
        status: "PENDING",
      })
      .returning("id");

    const orderId = newOrder.id;

    const orderItemsToInsert = items.map((cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id);
      return {
        order_id: orderId,
        menu_item_id: cartItem.id,
        quantity: cartItem.quantity,
        price: menuItem.price,
      };
    });

    await trx("order_items").insert(orderItemsToInsert);

    return orderId;
  });

  const order = await getOrderWithItems(newOrderId, db);

  return { orderId: newOrderId, order };
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

export const getOrderStatus = async (db, { orderId }) => {
  const order = await getOrderWithItems(orderId, db);
  if (!order) {
    return res
      .status(404)
      .json(jsonRpcErrorResponse(-32004, "Order not found", id));
  }
  return order
};
