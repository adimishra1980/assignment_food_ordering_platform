import { useParams } from "react-router-dom"

const OrderStatusPage = () => {
    const {orderId} = useParams();

  return (
    <div>
        order status with ID: {orderId}
    </div>
  )
}

export default OrderStatusPage
