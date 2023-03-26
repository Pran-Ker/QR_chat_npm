const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const fileInput = document.getElementById('file-input')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' }) // specify the upload directory

app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ filename: req.file.filename })
})



if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  const file = fileInput.files[0] 
  sendMessage(message, file) 
  messageInput.value = ''
  fileInput.value = '' 
})

socket.on('send-chat-message', async (roomName, formData) => {
  const { message, file } = Object.fromEntries(formData.entries())
  const name = await getUserName(socket.id)
  let fileUrl
  if (file) {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    })
    const { filename } = await response.json()
    fileUrl = `${window.location.origin}/uploads/${filename}`
  }
  io.to(roomName).emit('chat-message', { name, message, fileUrl })
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})


socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
  const imgElement = messageElement.querySelector('img')
  if (imgElement) {
    imgElement.addEventListener('load', () => {
      messageContainer.scrollTop = messageContainer.scrollHeight
    })
  } else {
    messageContainer.scrollTop = messageContainer.scrollHeight
  }
}


function sendMessage(message, file) {
  const formData = new FormData()
  formData.append('message', message)
  if (file) {
    formData.append('file', file)
  }
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', roomName, formData)
}
