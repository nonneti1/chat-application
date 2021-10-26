const socket = io();
const chatForm = document.getElementById("chat-form");
const urlParams = new URLSearchParams(window.location.search);
const chatDiv = document.querySelector(".middle");
const username = urlParams.get('user');
const room  = urlParams.get('room');
console.log(username,room);
function ToLoginPage(){
    location.href="/index.html";
}

socket.on("message", (message) => {
    console.log(message);
    // outputMessage(message);
  
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
  
    //Emit message to server
    socket.emit("chatMessage", msg);
  
    //Clear input
    e.target.elements.message.value = "";
    e.target.elements.message.focus();
  });