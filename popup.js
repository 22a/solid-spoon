document.addEventListener('DOMContentLoaded', function() {
  var socket = new Phoenix.Socket("ws://backspoon.cbrenn.xyz/socket", {});
  socket.connect();
  chrome.tabs.getSelected(null, function(tab) {
    var dummy = document.createElement('a');
    dummy.href = tab.url;
    var host = dummy.hostname;

    var channel = socket.channel("chat:" + host);
    channel.on("new_message", function(payload) {
      console.log("[" + payload.username + "] " + payload.message);
    });

    var connected = false;
    var username = "";
    var userInput = document.getElementById('username');
    userInput.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        username = userInput.value;
        channel.join();
        connected = true;
      }
    });

    setInterval(function() {
      if (connected) {
        channel.push("new_message", {host: host, username: username, message: "POW"});
      }
    }, 1000);
  });
});
