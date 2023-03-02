const express = require('express');
const path = require('path');
const qr = require('qrcode');
const WebSocket = require('ws');

const app = express();
const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Generate a random URL for the chat page
const chatUrl = `http://localhost:3000/${Math.random().toString(36).substring(2, 8)}`;

// Generate a QR code for the chat page
qr.toDataURL(chatUrl, (err, qrCodeUrl) => {
  if (err) throw err;
  console.log(`Scan this QR code to access the chat page: ${qrCodeUrl}`);
});

// Serve the chat page for the random URL
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// Set up the WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast messages to all connected clients
wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Handle WebSocket connections /ua9sbotg
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Handle incoming messages from clients
  ws.on('message', (data) => {
    console.log(`Received message: ${data}`);
    const message = JSON.parse(data);
    wss.broadcast(JSON.stringify(message));
  });
});
