const socket = io();
const chatForm = document.getElementById("chat-form");

function ToLoginPage(){
    location.href="/index.html";
}

const username = "chad";

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