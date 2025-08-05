import dotenv from "dotenv";

dotenv.config();


export default {
  development: {
    client: "pg",
    // --- TEMPORARY CHANGE FOR DEBUGGING ---
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'myuser',
      password: 'mypassword', // Hardcoded password
      database: 'food_ordering_app',
    },
    // ------------------------------------
    migrations: {
      directory: "./migrations",
    },
  },
};