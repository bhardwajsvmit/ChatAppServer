// const express = require("express");
// const app = express();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
// const port = 3000;

// io.on('connection',socket=>{
//   console.log('a user connected');

//   socket.join('some room');

//   io.to('some room').emit('some event','hello room');


//   socket.on('join room',room=>{
//     socket.to(room).emit("room joined","rooom joineed");
//   });

//   socket.on('message',({room,message})=>{
//     socket.to(room).emit('message',message)
//     console.log(message)
//   })

//   socket.on('chat message',msg=>{
//     console.log(msg)
//     io.emit('chat message', msg);
//   });
// });

// server.listen(process.env.PORT||port,()=> console.log(`server running on port ${port}`) );




const express = require("express");
const path = require("path")
const http = require('http')
const socketio = require("socket.io")
const { userJoin, getCurrentUser, userLeave }= require('./users')

const app = express();
const server = http.createServer(app)
const io = socketio(server);

const port = 3000;


io.on('connection',socket=>{
  console.log('new ws connection')
  socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id,username,room)

    socket.join(user.room)
    console.log(`${user.username} joined ${user.room}`)
    // socket.emit('message',`${user.username} welcome to chat cord ${user.room}`)
  
    // Broadcasts when user connections
    // socket.broadcast.to(user.room).emit('message',`${user.username} has joined the chatroom ${user.room}`)

  })



  
  socket.on('chatmessage',msg=>{
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message',msg)
    console.log(msg)
  })
  
  //runs when client disconnects

  socket.on('disconnect',()=>{
    const user = userLeave(socket.id)

    // if(user){

    //   io.to(user.room).emit('message',` ${user.username} has left the chat`)
    // }

    console.log('user disconnected')
  })

})



server.listen(process.env.PORT||port,()=> console.log(`server running on port ${port}`) );