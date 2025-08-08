export async function confirmPayment({ orderId, paymentRef }) {
  const [updatedOrder] = await db('orders')
    .where({ id: orderId })
    .update({ 
      status: 'PAID',
      payment_ref: paymentRef 
    })
    .returning('*');

  if (!updatedOrder) {
    throw new Error(`Order #${orderId} not found.`);
  }

  // We don't need to broadcast this to the kitchen, but in a real app,
  // we might broadcast to the customer on their order status page.
  
  return {status: updatedOrder.status};
}