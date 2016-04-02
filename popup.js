function insertBlah(blah) {
  document.getElementById('blah').textContent += blah;
}

document.addEventListener('DOMContentLoaded', function() {
  var socket = new Phoenix.Socket("ws://backspoon.cbrenn.xyz", {});
  socket.connect();
  chrome.tabs.getSelected(null, function(tab) {
    var dummy = document.createElement('a');
    dummy.href = tab.url;
    var channel = socket.channel("chat:" + dummy.hostname);
    insertBlah(dummy.hostname);
  });
});
