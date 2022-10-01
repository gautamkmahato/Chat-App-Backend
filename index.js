// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server, {
//     transports: ['websocket'],
//     maxHttpBufferSize: 1e9,
//     pingTimeout: 3000000,
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         credentials: true,
//         transports: ['websocket', 'polling']
//     },
//     allowEIO3: true
// });



//app.use(cors());

// const PORT = process.env.PORT || 8000;

// io.engine.on("connection_error", (err) => {
//     console.log(err);
//   });

// io.on('connection', (socket) =>{
//     socket.on('join', (data) =>{
//         socket.join(data.roomId);
//         socket.emit('sendJoinNotification', { text: `${data.userId}, welcome to room ${data.roomId}.`});
//     })
// })





const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  maxHttpBufferSize: 1e8,
  pingTimeout: 3000000,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  socket.on('join', (data) =>{
    socket.join(data.roomId);
    socket.emit('sendJoinNotification', { text: `${data.userId}, welcome to room ${data.roomId}.`});
  });

  socket.on('send', (data) =>{
    io.to(data.roomId).emit('receive', {text: data.text, roomId: data.roomId, userId: data.userId});
  });

  socket.on('uploadImage', async(base64, imageObject, callback) => {
    callback({
      status: "ok",
      base64: base64
    });
    io.to(imageObject.roomId).emit("getImageNotification", {
      imageNotification: "Image is received in Server...",
  });
    io.to(imageObject.roomId).emit("getImage", {
        base64: base64,
        roomId: imageObject.roomId,
        userId: imageObject.userId
    });
  });
});

app.get("/", (req, res) =>{
  res.json("This is Node Js Backend")
})

httpServer.listen(PORT, () =>{
  console.log("Server running on PORT 5000...")
});