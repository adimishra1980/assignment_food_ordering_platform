import express from "express";
import cors from "cors";
import knex from "knex";
import knexConfig from "../knexfile.js";
import {
  jsonRpcErrorResponse,
  jsonRpcSuccessResponse,
} from "./utils/jsonRpcResponse.js";

import { getMenu } from "./services/menuService.js";
import { placeOrder } from "./services/orderService.js";

const app = express();

// Initialize Knex to connect to the database
const db = knex(knexConfig.development);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

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
        result = await getMenu(db)
        return res.json(jsonRpcSuccessResponse(id, result));
      
      case "placeOrder":
        result = await placeOrder(db, params)
        return res.json(jsonRpcSuccessResponse(result, id));

      default:
        return res
          .status(400)
          .json(jsonRpcErrorResponse(-32601, "Method not found", id));
    }
  } catch (error) {
    return res
      .status(500)
      .json(jsonRpcErrorResponse(-32000, "Server error", id, error.message));
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send({ status: "OK" });
});

export default app;
