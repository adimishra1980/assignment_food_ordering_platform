# Food Ordering Platform - Project Plan

This document outlines the plan, milestones, and technical decisions for the full-stack food ordering platform assignment.

## 1. Technology Choices

This project will be built using the following technologies, as decided on [29/07/2025]:

-   **Frontend:** React 18 with Vite
-   **Styling:** Tailwind CSS 3.4
-   **State Management:** Redux Toolkit (with RTK Query)
-   **Backend:** Node.js 20 with Express 4/5
-   **Database:** PostgreSQL 15+
-   **Database Migrations:** Knex.js
-   **API Protocol:** JSON-RPC 2.0 and WebSockets
-   **Deployment:** Docker, docker-compose, and Render

## 2. Milestones & Timeline

[July 29, 2025] The project will follow the suggested 10-day timeline[cite: 84].

| Day(s) | Target Output                                         | Status      |
| :----- | :---------------------------------------------------- | :---------- |
| 0      | Project Planning (PLAN.md)                            | Completed   |
| 1-2    | Frontend: Scaffolding, routing, and basic layout      | To-Do       |
| 3-4    | Frontend: Menu and Cart components (mock data)        | To-Do       |
| 4-6    | Backend: Express server, DB migrations, seed data     | To-Do       |
| 4-6    | Frontend: Checkout form and Order Tracker page        | To-Do       |
| 5-6    | Backend: Core JSON-RPC methods implemented            | To-Do       |
| 6-7    | Backend: WebSocket gateway for live order events      | To-Do       |
| 7-8    | Integration: Connect Frontend to Backend API          | To-Do       |
| 8-9    | DevOps: Dockerize Frontend and Backend apps           | To-Do       |
| 9-10   | Deployment: Deploy to Render and finalize documentation | To-Do       |
| Stretch| Add automated tests and CI/CD pipeline                | Optional    |

## 3. Risk Table

The following risks have been identified, along with mitigation strategies.

| Risk                                     | Likelihood | Impact | Mitigation Strategy                                                                                                                              |
| :--------------------------------------- | :--------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| Inexperience with PostgreSQL and Docker. | Medium     | High   | Follow step-by-step guidance. [cite_start]Use Knex.js to simplify database work and `docker-compose.yml` to manage services locally and simplify setup[cite: 77]. |
| Inexperience with the JSON-RPC protocol. | Medium     | High   | [cite_start]Implement a reusable client-side wrapper (`rpcClient.ts` [cite: 44][cite_start]) and follow clear examples for backend handlers to ensure spec compliance.  |
| Tight 10-day timeline for all features.  | High       | Medium | [cite_start]Prioritize core features over optional "bonus" items[cite: 95]. Stick closely to the milestone plan to ensure steady progress.                      |