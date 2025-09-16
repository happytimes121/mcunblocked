// server.js
import WebSocket, { WebSocketServer } from "ws";
import net from "net";

const WSPORT = process.env.PORT || 8080; // Render gives you PORT
const MC_HOST = "bloodbath321.aternos.me";
const MC_PORT = 25565;

const wss = new WebSocketServer({ port: WSPORT });

wss.on("connection", (ws) => {
  console.log("Browser client connected");

  // connect to Minecraft server
  const mcSocket = net.createConnection(MC_PORT, MC_HOST);

  // pipe data from MC → Browser
  mcSocket.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });

  // pipe data from Browser → MC
  ws.on("message", (msg) => {
    mcSocket.write(msg);
  });

  ws.on("close", () => {
    mcSocket.end();
  });

  mcSocket.on("end", () => {
    ws.close();
  });
});

console.log("Eaglercraft proxy running on port " + WSPORT);
