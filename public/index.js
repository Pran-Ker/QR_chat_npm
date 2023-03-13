const express = require('express');
const path = require('path');
const qr = require('qrcode');

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
