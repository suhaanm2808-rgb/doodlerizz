const socket = io();
const params = new URLSearchParams(window.location.search);
const room = params.get("room");

document.getElementById("room").innerText = room;
socket.emit("join-room", room);

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.onmousemove = e => {
  if (e.buttons !== 1) return;
  socket.emit("draw", { x: e.offsetX, y: e.offsetY, room });
};

socket.on("draw", data => {
  ctx.fillRect(data.x, data.y, 4, 4);
});
