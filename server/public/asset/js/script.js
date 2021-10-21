const socket = io();

function ToLoginPage(){
    location.href="/index.html";
}

const username = "chad";
socket.on('connect',()=>{
    socket.emit('whoami',(username)=>{
        
    });
})