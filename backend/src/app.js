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
import { acceptOrder, listOrders, placeOrder, updatedOrderStatus } from "./services/orderService.js";
import { InitializeWebSocket } from "./websocket.js";

const app = express();
// Create HTTP server and bind Express app
const server = http.createServer(app);

// Initialize WebSocket and get the wss instance
const wss = InitializeWebSocket(server);

// Initialize Knex to connect to the database
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
  wss.clients.forEach((client) => {
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
        broadcast({type: "order_created", payload: result})

        return res.json(jsonRpcSuccessResponse(id, result));

      case "listOrders":
        result = await listOrders(db, params);
        return res.json(jsonRpcSuccessResponse(id, result));

      case "acceptOrder":
        result = await acceptOrder(db, params)


        return res.json(jsonRpcSuccessResponse(id, result));

      case "updateOrderStatus":
        result = await updatedOrderStatus(db, params)

        
        return res.json(jsonRpcSuccessResponse(id, result))

      default:
        return res
          .status(400)
          .json(jsonRpcErrorResponse(-32601, "Method not found", id));
    }
  } catch (error) {
    console.log("error in backend", error)
    return res
      .status(500)
      .json(jsonRpcErrorResponse(-32000, "Server error", id, error.message));
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send({ status: "OK" });
});

export  {app, server};
