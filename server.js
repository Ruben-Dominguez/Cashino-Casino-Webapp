const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Agregando las funciones del user.js al server

const{userConnected, choices, connectedusers, initializeChoices,makeMove, moves} = require("./public/juegos/prs/users");

//Agregando las funciones del room.js al server

const{joinRoom, createRoom, exitRoom, rooms} = require ("./public/juegos/prs/rooms");

// Mongodb prueba

const { MongoClient } = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://admin:admin@cashino.osihp.mongodb.net/cashino?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// end mongo prueba

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Conexiones

io.on('connection', socket => {
  console.log('a user connected');

  /*socket.on('disconnect', () => {
    console.log('user disconnected');
  });*/

  // creacion de cuenta nueva
  socket.on("cuenta-nueva", cuenta => {
    // console.log(cuenta.username + "\n" + cuenta.password);

    cuentaNueva(cuenta);

    async function cuentaNueva(cuenta) {
      try {
        await client.connect();
        const database = client.db('cashino');
        const users = database.collection('users');
    
        let count = await users.countDocuments({username: cuenta.username});
        if (count > 0) {
          socket.emit('error-cuenta-ya-registrada', {message: "Error, cuenta ya registrada"});
        } else {
          await users.updateOne({username: cuenta.username, password: cuenta.password, wongbucks: 1000});
          socket.emit('cuenta-correcta', {message: "Cuenta registrada corretamente"});
        }
      } finally {
        await client.close();
      }
    }

  });


  //Creando el room con socket prs
  socket.on("create-room", (roomId,user) => {
    if(rooms[roomId]){
      const error = "This room already exists";
      socket.emit("display-error", error);
    }else{
      userConnected(socket.client.id);
      createRoom(roomId, socket.client.id);
      socket.emit("room-created", roomId);
      socket.emit("player-1-connected");
      socket.join(roomId);
    }
  })

  socket.on("join-room", (roomId,user) => {
    if(!rooms[roomId]){
      const error = "This room doen't exist";
      socket.emit("display-error", error);
    }else{
      userConnected(socket.client.id);
      joinRoom(roomId, socket.client.id);
      socket.join(roomId);

      socket.emit("room-joined", roomId);
      socket.emit("player-2-connected");
      socket.broadcast.to(roomId).emit("player-2-connected");
      initializeChoices(roomId);
    }
  })

  socket.on("join-random", () => {
    let roomId = "";

    for(let id in rooms){
      if(rooms[id][1] === ""){
        roomId = id;
        break;
      }
    }

    if(roomId === ""){
      const error = "All rooms are full or none exists";
      socket.emit("display-error", error);
    }else{
      userConnected(socket.client.id);
      joinRoom(roomId, socket.client.id);
      socket.join(roomId);

      socket.emit("room-joined", roomId);
      socket.emit("player-2-connected");
      socket.broadcast.to(roomId).emit("player-2-connected");
      initializeChoices(roomId);
    }
  });

  socket.on("make-move", ({playerId, myChoice, roomId}) => {
    makeMove(roomId, playerId, myChoice);

    if(choices[roomId][0] !== "" && choices[roomId][1] !== ""){
      let playerOneChoice = choices[roomId][0];
      let playerTwoChoice = choices[roomId][1];

      if(playerOneChoice === playerTwoChoice){
        let message = "Both of you chose " + playerOneChoice + " . So it's draw";
        io.to(roomId).emit("draw", message);
          
      }else if(moves[playerOneChoice] === playerTwoChoice){
        let enemyChoice = "";

        if(playerId === 1){
          enemyChoice = playerTwoChoice;
        }else{
          enemyChoice = playerOneChoice;
        }

        io.to(roomId).emit("player-1-wins",);
      }else{
        let enemyChoice = "";

        if(playerId === 1){
          enemyChoice = playerTwoChoice;
        }else{
          enemyChoice = playerOneChoice;
        }

        io.to(roomId).emit("player-2-wins",);
      }

      choices[roomId] = ["", ""];
    }
  });

  socket.on("disconnect", () => {
      if(connectedusers[socket.client.id]){
        let player;
        let roomId;

        for(let id in rooms){
          if(rooms[id][0] === socket.client.id || 
            rooms[id][1] === socket.client.id){
            if(rooms[id][0] === socket.client.id){
              player = 1;
            }else{
              player = 2;
            }

            roomId = id;
            break;
          }
        }

        exitRoom(roomId, player);

        if(player === 1){
          io.to(roomId).emit("player-1-disconnected");
        }else{
          io.to(roomId).emit("player-2-disconnected");
        }
    }
  })

  socket.on("ppt-winner", ({user,roomId}) => {
    console.log("winner", roomId, user);
    exitRoom(roomId, 1);
    io.to(roomId).emit("player-1-disconnected");


    //add wongbucks
    addMoney(user, 300);

    async function addMoney(user, amount) {
      try {
        await client.connect();
        const database = client.db('cashino');
        const users = database.collection('users');
        updating = await users.findOne({username: user},);
        updating.wongbucks = updating.wongbucks + amount;
        console.log(updating);
        var setting = {$set: { wongbucks: updating.wongbucks}}
        await users.updateOne({username: user}, setting);
      } finally {
        await client.close();
      }
    }
  });

  // funcion para poder iniciar cuenta
  socket.on("iniciarSesion", cuenta => {
    // console.log(cuenta.username + "\n" + cuenta.password);

    iniciarSesion(cuenta);

    async function iniciarSesion(cuenta) {
      try {
        await client.connect();
        const database = client.db('cashino');
        const users = database.collection('users');

        let count = await users.countDocuments({username: cuenta.username,  password: cuenta.password});
        if(count > 0) {
          let user = await users.findOne({username: cuenta.username,  password: cuenta.password});
          // await console.log(user);

          socket.emit('cuentaCorrecta', {message: "Cuenta correcta", userFound: user});

        } else {
          socket.emit('cuentaIncorrecta', {message: "Cuenta no encontrada, intente de nuevo"});
        }

      } finally {
        await client.close();
      }
    }

  });
});





