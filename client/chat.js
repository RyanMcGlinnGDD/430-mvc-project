"use strict";
let socket;
let nickname;
let username;
let textField;

let chatMessageSection;

const init = () => {
  //get elements
  nickname = document.getElementById("nickname").value;
  username = document.getElementById("username").value;
  textField = document.getElementById("chatText");
  chatMessageSection = document.getElementById("chatMessageSection");
  
  //initialize sockets
  setupSocket();
  
  //button to emit messages
  document.getElementById("chatButton").addEventListener('click', () => {
    if(textField.value !== ""){
      socket.emit('requestMessage', { nickname: nickname, message: textField.value  });
      textField.value = "";
    }
  });
  document.getElementById("chatText").addEventListener('keypress', (e) => {
    if(textField.value !== ""){
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        socket.emit('requestMessage', { nickname: nickname, message: textField.value  });
        textField.value = "";
      }
    }
  });
  
  socket.emit('join', { username: username, nickname: nickname });
}

//initializes and sets up socket.on calls
const setupSocket = () => {
  socket = io.connect();
  
  socket.on('serveMessage', (data) => {
    chatMessageSection.innerHTML += `<div class="chatMessage"><div class="chatMessageName"><p>${data.nickname}</p></div><div class="chatMessageText"><p>${data.message}</p></div></div>`;
    scrollDown();
  });
}

const scrollDown = () => {
  chatMessageSection.scrollTop = chatMessageSection.scrollHeight;
}

$(document).ready(function() {
    init();
});