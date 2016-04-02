document.addEventListener('DOMContentLoaded', function() {
  var socket = new Phoenix.Socket("ws://backspoon.cbrenn.xyz/socket", {});
  socket.connect();
  chrome.tabs.getSelected(null, function(tab) {
    var dummy = document.createElement('a');
    dummy.href = tab.url;
    var host = dummy.hostname;

    var messageContainer = document.getElementById('messages');
    var channel = socket.channel("chat:" + host);

    channel.on("new_message", function(payload) {
      messageContainer.innerHTML += '<p><strong class="message-username">' + payload.username + '</strong>' + payload.message + '</p>';
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    var userInput = document.getElementById('username');
    userInput.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        document.getElementById('tint').className += " evanesco";
        channel.join().receive("ok", onJoined(channel, host, userInput.value));
      }
    });
  });
});

function onJoined(channel, host, username) {
  return function() {
    setInterval(function() {
      channel.push("new_message", {host: host, username: username, message: "POW"});
    }, 1000);
  };
}
