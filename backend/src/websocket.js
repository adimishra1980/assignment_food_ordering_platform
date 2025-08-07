import { WebSocketServer } from "ws";

export function InitializeWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Kitchen client connected via webSocket");

    ws.on("close", () => {
      console.log("Kitchen client disconnected");
    });

    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "You are connected to the live order feed!",
      })
    );
  });
  return wss;
}
