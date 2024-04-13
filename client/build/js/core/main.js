const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', function () {
  console.log('Connected to server');
});

ws.addEventListener('message', function (event) {
  console.log('Received from server:', event.data);
});

ws.addEventListener('error', function (event) {
  console.error('WebSocket error:', event);
});

const connect = () => {
  let nickname = document.getElementById("nickname")
  ws.send(JSON.stringify({
    type: 'new-user',
    payload: nickname.value
  }))
}