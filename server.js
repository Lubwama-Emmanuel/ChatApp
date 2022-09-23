const app = require("./app");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
  userJoin,
  currentUser,
  userLeft,
  getAllRoomUsers,
} = require("./utils/users");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const server = http.createServer(app);
const io = socketio(server);

const name = "RexsApp";
// Run Wen Client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // We Join the room from the one selected in the URL
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(name, "Welcome to the Real-time Chat App"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(name, `${user.username} has joinned the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getAllRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = currentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  // Runs when the user disconnects
  socket.on("disconnect", () => {
    const user = userLeft(socket.id);

    if (user) {
      io.emit(
        "message",
        formatMessage(name, `${user.username} has left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getAllRoomUsers(user.room),
      });
    }
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on PORT:${port}`);
});
