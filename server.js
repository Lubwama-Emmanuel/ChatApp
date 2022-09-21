const app = require("./app");
const http = require("http");
const socketio = require("socket.io");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const server = http.createServer(app);
const io = socketio(server);

// Run Wen Client connects
io.on("connection", (socket) => {
  console.log("NEW WebSocket Connection");
});


const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on PORT:${port}`);
});
