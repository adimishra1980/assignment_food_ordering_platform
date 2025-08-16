# Food Ordering Platform

This is a full-stack food ordering web platform built as a 10-day technical assignment. It features a customer-facing interface for Browse a menu and placing orders, and a real-time kitchen dashboard for staff to manage incoming orders.

---

## 🚀 Quick Start (Local Development)

This project is fully containerized with Docker. To run it, you will need **Git** and **Docker Desktop** installed.

1.  **Clone the repository:**

    ```sh
    git clone <YOUR_GITHUB_REPOSITORY_URL>
    cd <your-project-folder>
    ```

2.  **Create the Environment File:**

    - Navigate to the `/backend` folder.
    - Copy the `env.sample` file to a new file named `.env`.
    - Navigate to the `/frontend` folder.
    - Copy the `env.sample` file to a new file named `.env`.

3.  **Build and Run with Docker Compose:**
    From the project's **root directory**, run the following single command but before doing this make sure you docker-desktop is running:

    ```sh
    docker-compose up --build
    ```

    This command will build the images for the frontend and backend, start all three containers, and run the database migrations.

4.  Run the migrations and seed the database with sample data
    After containers are up, run:

        docker-compose exec backend npm run migrate
        docker-compose exec backend npm run seed

5.  Open your browser:

- Frontend UI: `http://localhost:5173`
- Backend RPC & API: `http://localhost:8000/rpc`
- WebSocket: `ws://localhost:8000/ws`

---

## 🛠️ Tech Stack

| Area     | Technology                               |
| :------- | :--------------------------------------- |
| Frontend | React, Vite, Redux Toolkit, Tailwind CSS |
| Backend  | Node.js, Express, WebSockets, Knex.js    |
| Database | PostgreSQL                               |
| DevOps   | Docker, Docker Compose                   |

---

## API Table

| Method              | Parameters                                               | Response              |
| ------------------- | -------------------------------------------------------- | --------------------- |
| `getMenu`           | `{ since?: string }`                                     | Array of menu items   |
| `placeOrder`        | `{ items: [], customer: object, paymentMethod: string }` | `{ orderId: number }` |
| `listOrders`        | `{ status?: string, limit?: number }`                    | Array of orders       |
| `acceptOrder`       | `{ orderId: number }`                                    | Updated order object  |
| `updateOrderStatus` | `{ orderId: number, status: string }`                    | Updated order object  |
| `confirmPayment`    | `{ orderId: number, paymentRef: string }`                | Updated order object  |

### Sample cURL Request (`placeOrder`)

```sh
curl -X POST -H "Content-Type: application/json" \
-d '{
  "jsonrpc": "2.0",
  "method": "placeOrder",
  "params": {
    "customer": { "name": "John Doe", "phone": "123-456-7890" },
    "items": [{ "id": 1, "quantity": 2 }]
  },
  "id": 1
}' \
http://localhost:8000/rpc

```

## WebSocket Event Samples

- `order_created`:  
   {
  "type": "order*created",
  "payload": { /* full order object \_/ }
  }

  - `order_updated`:

  {
  "type": "order*updated",
  "payload": { /* updated full order object \_/ }
  }

## Trade-offs

## Deployment URLs

- **Frontend URL:** _[Add your deployed frontend URL here]_
- **Backend RPC & WebSocket URL:** _[Add your deployed backend URL here]_

## Technology Choices and Trade-offs

The technology stack for the Food Ordering Platform was selected based on balancing developer productivity, system performance, maintainability, scalability, and feature requirements.

- React 18 + Tailwind CSS → Rapid UI development with utility-first styling

- Redux Toolkit → Predictable, debuggable global state

- Node.js + Express → Lightweight, widely supported

- JSON-RPC 2.0 → Strict spec, clear error handling, supports batching

- WebSocket (ws) → Low-latency, fine control over heartbeat/backpressure

- PostgreSQL → ACID compliance, strong constraint enforcement

- Docker & Compose → Consistent dev/test/prod environments

This technology stack ensures a scalable, maintainable, and high-performing platform.
