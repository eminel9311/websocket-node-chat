// server.js
const WebSocket = require("ws");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "info",
      message: "Welcome to the chat!",
    })
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      // Broadcast message to all connected clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "message",
              username: data.username,
              message: data.message,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

app.use(express.static("public"));
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
