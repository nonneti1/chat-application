const socket = io();
const chatForm = document.getElementById("chat-form");
const urlParams = new URLSearchParams(window.location.search);
const chatDiv = document.querySelector(".middle");
const roomName = document.getElementById("roomName");
const members = document.querySelector("#member-amount span");
const userList = document.getElementById("users");
const username = urlParams.get("user");
const room = urlParams.get("room");
console.log(username, room);
function ToLoginPage() {
  location.href = "/index.html";
}

socket.on("message", (message) => {
  // outputMessage(message);
  outputMessage(message);
  // Scroll down
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

//Join chatroom
socket.emit("joinRoom", { username, room });

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.message.value;
  if (!msg) {
    return false;
  }
  //Emit message to server
  socket.emit("chatMessage", msg, true);

  //Clear input
  e.target.elements.message.value = "";
  e.target.elements.message.focus();
});

// Get room and users detail
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room, users.length,users);
  outputUsers(users);
  console.log(room, users, users.length);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("chat-message");
  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon-user");
  const iconImg = document.createElement("img");
  message.username !== "ChatIO" ? iconImg.src = "image/guest.jpg" :iconImg.src = "image/bot.jpg";
  iconDiv.appendChild(iconImg);
  const textDiv = document.createElement("div");
  textDiv.classList.add("message-text");
  const pTitle = document.createElement("p");
  pTitle.classList.add("user-title");
  pTitle.innerText = message.username;
  pTitle.innerHTML += `<span class="meta"> ${message.time}</span>`;
  const pText = document.createElement("p");
  pText.innerText = message.text;
  textDiv.appendChild(pTitle);
  textDiv.appendChild(pText);

  if (message.username === username) {
    div.classList.add("sent");
    div.appendChild(textDiv);
  } else {
    div.appendChild(iconDiv);
    div.appendChild(textDiv);
  }
  document.querySelector(".middle").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room, usersTotal,users) {
  const onlineMember = users.filter(val=>{
    return val.active;
  })
  roomName.innerText = room;
  members.innerText = `${usersTotal} Members, ${onlineMember.length} Online`;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");

    li.innerHTML = `<div class="icon-user">
        <img src="image/guest.jpg" alt="" />
        <div class="status-circle ${user.active === 1 ? 'active':'offline'}"></div>
        <div class="user-name">${user.username}</div>
      </div>`;
    userList.appendChild(li);
  });
}


function leave() {
  socket.emit("leaveRoom",username);
  window.history.back();
}