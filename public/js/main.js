const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");
const socket = io();

// get info my the url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join Room
socket.emit("joinRoom", { username, room });

// GEt room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});
// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message from submit
  const msg = e.target.elements.msg.value;

  // Send message to server
  socket.emit("chatMessage", msg);

  //   Empty the field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoom(room) {
  roomName.innerHTML = room;
}

function outputUsers(users) {
  usersList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
