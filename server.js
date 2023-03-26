const express = require('express');
const qrcode = require('qrcode');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};
const db = new sqlite3.Database('messages.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.get('/', (req, res) => {
  // Generate QR code for each room URL
  const roomUrls = Object.keys(rooms).map(room => {
    const url = `${req.protocol}://${req.get('host')}/${room}`;
    const qr = qrcode.toDataURL(url);
    return { name: room, qr: qr };
  });
  res.render('index', { rooms: rooms, roomUrls: roomUrls });
});

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/');
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  
  io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  
  const url = `${req.protocol}://${req.get('host')}/${req.params.room}`;
  const qr = qrcode.toDataURL(url);
  res.render('room', { roomName: req.params.room, qr: qr });
});

app.post('/:room/messages', (req, res) => {
  const username = req.body.username;
  const message = req.body.message;
  db.run(`INSERT INTO messages (username, message) VALUES (?, ?)`, [username, message], (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
    io.emit('chat-message', { username: username, message: message });
  });
});

server.listen(3000);

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).emit('user-connected', name);
  });
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
  });
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
