// server.js
// Eaglercraft WebSocket proxy for Render
// Routes browser WebSocket traffic to your Aternos Minecraft server

import WebSocket, { WebSocketServer } from "ws";
import net from "net";

const WSPORT = process.env.PORT || 8080; // Render assigns PORT automatically
const MC_HOST = "bloodbath321.aternos.me"; // your Aternos server
const MC_PORT = 16708; // your Aternos server port

// Create WebSocket server for browser clients
const wss = new WebSocketServer({ port: WSPORT });

wss.on("connection", (ws) => {
  console.log("Browser client connected");

  // Connect to the Aternos Minecraft server
  const mcSocket = net.createConnection(MC_PORT, MC_HOST, () => {
    console.log(`Connected to Minecraft server at ${MC_HOST}:${MC_PORT}`);
  });

  // Forward Minecraft → Browser
  mcSocket.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  // Forward Browser → Minecraft
  ws.on("message", (msg) => {
    mcSocket.write(msg);
  });

  // Handle disconnects
  ws.on("close", () => {
    console.log("Browser disconnected");
    mcSocket.end();
  });

  mcSocket.on("end", () => {
    console.log("Minecraft server closed connection");
    ws.close();
  });

  mcSocket.on("error", (err) => {
    console.error("Minecraft socket error:", err.message);
    ws.close();
  });
});

console.log("Eaglercraft proxy running on port " + WSPORT);
