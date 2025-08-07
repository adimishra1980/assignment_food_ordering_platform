import dotenv from "dotenv";
import { server } from "./app.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8001;

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
