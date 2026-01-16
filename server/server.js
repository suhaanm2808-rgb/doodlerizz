const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidV4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve frontend
app.use(express.static("."));

const rooms = {};

io.on("connection", socket => {

  socket.on("create-room", () => {
    const roomId = uuidV4().slice(0, 6);
    rooms[roomId] = [];
    socket.join(roomId);
    socket.emit("room-created", roomId);
  });

  socket.on("join-room", roomId => {
    if (!rooms[roomId]) return;
    socket.join(roomId);
    rooms[roomId].push(socket.id);
  });

  socket.on("draw", data => {
    socket.to(data.room).emit("draw", data);
  });
});

server.listen(3000, () => {
  console.log("🔥 DoodleRizz running on http://localhost:3000");
});
