function addMessage(html){
  var messageContainer = document.getElementById('messages');
  messageContainer.innerHTML += html;
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

var userColours = {};

function getColourString(username) {
  if (!userColours[username]) {
    userColours[username] = Math.floor(Math.random() * 16777215).toString(16);
  }
  return userColours[username];
}

function gifString(payload) {
  return '<p>[' + moment().format('HH:mm') + ']<strong class="message-username">giphy</strong><img class="giphy" src="' + payload.url + '"></p>';
}

function messageString(payload) {
  var colour = getColourString(payload.username);
  return '<p><table class="message-table"><tr><td class="message-meta">[' + moment().format('HH:mm') + ']<strong class="message-username" style="color: #' + colour + '">' + payload.username + '</strong></td><td class="message-data">' + payload.message + '</td></tr></p>';
}

document.addEventListener('DOMContentLoaded', function() {
  var socket = new Phoenix.Socket("ws://backspoon.cbrenn.xyz/socket", {});
  socket.connect();
  chrome.tabs.getSelected(null, function(tab) {
    var dummy = document.createElement('a');
    dummy.href = tab.url;
    var host = dummy.hostname;

    var channel = socket.channel("chat:" + host);

    channel.on("new_message", function(payload) {
      addMessage(messageString(payload));
    });

    channel.on("new_gif", function(payload) {
      addMessage(gifString(payload));
    });

    var userInput = document.getElementById('username');
    userInput.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        document.getElementById('tint').className += " evanesco";
        document.getElementById('input-container').style.zIndex = "1";
        channel.join().receive("ok", onJoined(channel, host, userInput.value));
      }
    });
  });
});

function onJoined(channel, host, username) {
  return function() {
    addMessage('<h3 class="centered">Welcome to ' + host + ' chat!</h3>');
    var messageInput = document.getElementById('message');
    messageInput.addEventListener('keypress', function(e) {
      var input = messageInput.value;
      if (e.keyCode === 13 && input && input.length > 0) {
        channel.push("new_message", {host: host, username: username, message: messageInput.value});
        messageInput.value = '';
      }
    });
  };
}
