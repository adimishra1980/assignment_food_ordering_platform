import express from "express";
import cors from "cors";
import knex from "knex";
import knexConfig from "../knexfile.js";
import {
  jsonRpcErrorResponse,
  jsonRpcSuccessResponse,
} from "./utils/jsonRpcResponse.js";
import http from "http";
import { WebSocketServer } from "ws";

import { getMenu } from "./services/menuService.js";
import {
  acceptOrder,
  getOrderStatus,
  listOrders,
  placeOrder,
  updatedOrderStatus,
} from "./services/orderService.js";
import { InitializeWebSocket } from "./websocket.js";
import { confirmPayment } from "./services/paymentService.js";

const app = express();
// Create HTTP server and bind Express app
const server = http.createServer(app);

// Initialize WebSocket and get the wss instance
const wss = InitializeWebSocket(server);

// Initialize Knex to connect to the database
// TODO: in production, don't use the development config
// decide with environment variables for confing in production
const db = knex(knexConfig.development);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

// Helper function to broadcast messages
function broadcast(wss, message) {
  wss.clients?.forEach((client) => {
    if (client.readyState === client.OPEN) {
      // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
}

app.post("/rpc", async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== "2.0" || !method || !id) {
    return res
      .status(400)
      .json(jsonRpcErrorResponse(-32600, "Invalid Request", id));
  }

  try {
    let result;

    switch (method) {
      case "getMenu":
        result = await getMenu(db);
        return res.json(jsonRpcSuccessResponse(id, result));

      case "placeOrder":
        result = await placeOrder(db, params);
        // Broadcast new order event after saving order to DB
        broadcast(wss, { type: "order_created", payload: result });
        return res.json(jsonRpcSuccessResponse(id, result));

      case "listOrders":
        result = await listOrders(db, params);
        return res.json(jsonRpcSuccessResponse(id, result));

      case "acceptOrder":
        result = await acceptOrder(db, params);
        broadcast(wss, { type: "order_updated", payload: result });
        return res.json(jsonRpcSuccessResponse(id, result));

      case "updateOrderStatus":
        result = await updatedOrderStatus(db, params);
        broadcast(wss, { type: "order_updated", payload: result });
        return res.json(jsonRpcSuccessResponse(id, result));

      case "getOrderStatus":
        result = await getOrderStatus(db, { orderId: params.orderId });
        return res.json(jsonRpcSuccessResponse(id, result));

      case "confirmPayment":
        result = await confirmPayment(db, { orderId: params.orderId });
        broadcast(wss, { type: "order_updated", payload: result });
        return res.json(jsonRpcSuccessResponse(id, result));

      default:
        return res
          .status(400)
          .json(jsonRpcErrorResponse(-32601, "Method not found", id));
    }
  } catch (error) {
    console.log("error in backend", error);
    return res
      .status(500)
      .json(jsonRpcErrorResponse(-32000, "Server error", id, error.message));
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send({ status: "OK" });
});

export { app, server };
