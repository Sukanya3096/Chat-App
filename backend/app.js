const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const MONGODB_URI = 'mongodb+srv://Sukanya30:Nj5c0TuQxNf0zqVH@firstcluster.5i0o6rt.mongodb.net/Chatapp';

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(3000);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log(`Client Connected ${socket.id}`);
        socket.on('join', data => {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('New User Joined')
        })

        socket.on('message', data => {
            io.in(data.room).emit('New message!', {user: data.user, message: data.message})
        })
    })
  })
  .catch((err) => console.log(err));
