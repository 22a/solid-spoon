function addMessage(html){
  var messageContainer = document.getElementById('messages');
  messageContainer.innerHTML += html;
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function messageString(payload){
  return '<p>[' + moment().format('HH:mm') + ']<strong class="message-username">' + payload.username + '</strong>' + payload.message + '</p>';
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
        channel.push("new_message", {host: host, username: username, message: messageInput.value})
        messageInput.value = '';
      }
    });
  };
}
