# Food Ordering Platform Architecture

## Overview

This document outlines the architecture of the Food Ordering Platform, a comprehensive full-stack application aimed at providing a seamless food ordering experience with real-time kitchen management and analytics.

## System Components

- **Frontend:** React 18, using either Vite or Next.js, styled with Tailwind CSS. Provides customer interfaces for browsing, ordering, and tracking, as well as kitchen staff dashboards.

- **Backend:** Node.js (20), Express (4/5), implementing JSON-RPC 2.0 API over HTTP and serving as a WebSocket server for real-time event updates.

- **Database:** PostgreSQL 15+, structuring menu items, orders, and order items with strong data integrity and order state enforcement.

## Context Diagram

```plaintext
+------------------+          +------------------+          +----------------+
|  Customer Client | <----->  |   Backend API    | <=====>  |   PostgreSQL   |
| (Browser / App)  |          | (Node/Express)   |          |    Database    |
+------------------+          +------------------+          +----------------+
          |                           |                             |
          +-----------> WS / Events -+                             |
          |                           +-----------> DB Reads/Writes  |
          |                                                         |
 +------------------+                                               |
 | Kitchen Dashboard | <---------------------------------------------+
 +------------------+


```

## Sequence Diagram - Order Placement

```plaintext
Customer        Frontend        Backend         Database       Kitchen Dashboard
    |               |               |               |                   |
    |--- Request Menu (getMenu) --->|               |                   |
    |               |--- RPC getMenu --->         |                   |
    |               |               |-- Query Menu -->|                   |
    |               |               |<----- Menu ---- |                   |
    |<-- Return Menu (getMenu) ------|               |                   |
    |-- Place Order Request (placeOrder) -->         |                   |
    |               |---- RPC placeOrder ---->       |                   |
    |               |               |-- Insert Order ->|                   |
    |               |               |<--- Order Id ----|                   |
    |               |<-- Return Order Id ------------|                   |
    |               |               |---- Broadcast order_created -------->
    |               |               |               |----> Receive Event --->
    |               |<--- Receive Event (order_created)-------------------|
                          |              |             |
```

## Explanation of RPC vs REST

- **RPC (Remote Procedure Call):** Presents a clear, method-oriented interface, allowing clients to invoke operations with specified parameters. Facilitates batch processing of requests, reducing network overhead.

- **REST (Representational State Transfer):** Focuses on resource-based interactions with standard HTTP verbs (GET, POST, PUT, DELETE). While widely adopted, REST can become verbose for complex operations requiring multiple calls.

- This project opts for **JSON-RPC 2.0** because:
  - It provides strict request/response structures enhancing reliability and clarity.
  - Supports batching of multiple RPCs in a single request.
  - Simplifies error handling per method.
  - Complements the real-time WebSocket approach for dedicated event streams.

---

_Version 1.0_
"""
