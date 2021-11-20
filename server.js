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

const{userConnected, choices, connectedusers, initializeChoices,makeMove, moves} = require("./prs/users");

//Agregando las funciones del room.js al server

const{joinRoom, createRoom, exitRoom, rooms} = require ("./prs/rooms");

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

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

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
          await users.insertOne({username: cuenta.username, password: cuenta.password, wongbucks: 1000});
          socket.emit('cuenta-correcta', {message: "Cuenta registrada corretamente"});
        }
      } finally {
        await client.close();
      }
    }

  });


  //Creando el room con socket prs
  socket.on("create-room", (roomId) => {
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
  });

  //Uniendonos al room prs

  socket.on("join-room", roomId => {
      if(!rooms[roomId]){
        const console = "This room doesnt exists";
        socket.emit("display-error", error);
      }else{
        
      }
      userConnected(socket.client.id);
      createRoom(roomId, socket.client.id);
      socket.emit("room-joined", roomId);
      socket.emit("player-2-connected");
      socket.join(roomId);
  });

  //Uniendonos a uno random prs

  socket.on("join-random", () => {
      let roomId = "";

      for(let id in rooms){
        if(rooms[id][1]=== ""){
          roomId = id;
          break;
        }
      }
      if(roomId === ""){
        const error = "All rooms are full or non available";
        socket.emit("display-error", error);
      }else{
        userConnected(socket.client.id);
        createRoom(roomId, socket.client.id);
        socket.emit("room-joined", roomId);
        socket.emit("player-2-connected");
        socket.join(roomId);
      }
  });

  //Realizando movimientos Prs
  socket.on("make-move", ({playerId, myChoice, roomId}) =>{
      makeMove(roomId,playerId,myChoice);

      if(choices[roomId][0] !== "" && choices [roomId][1] !== ""){
        let playerOneChoice = choices[roomId][0];
        let playerTwoChoice = choices[roomId][1];

        if(playerOneChoice === playerTwoChoice ){
          let message = "Hay un empate, escogieron lo mismo" +playerOneChoice 
          io.to(roomId).emit("draw", message);
        }else if(moves[playerOneChoice] === playerTwoChoice) {
          let enemyChoice = "";

          if(playerId === 1){
            enemyChoice = playerTwoChoice;
          }else{
            enemyChoice = playerOneChoice;
          }
          choices[rooms] = ["", ""]
          io.to(roomId).emit("player-1-wins",{myChoice, enemyChoice});
        } else{
            let enemyChoice = "";

            if(playerId === 1){
              enemyChoice = playerTwoChoice;
            }else{
              enemyChoice = playerOneChoice;
            }
            choices[rooms] = ["", ""]
            io.to(roomId).emit("player-2-wins",{myChoice, enemyChoice});
        }
      }

  })
  //Desconeccion del room
  socket.on("disconnect", () =>{
    if(connectedusers[socket.client.id]){
      let player;
      let roomId;

      for(let id in rooms){
        if(rooms[id[0]] === socket.client.id ||
             rooms[id][1] === socket.client.id){
              if(rooms[id[0]] === socket.client.id){
                  player =1;
                }else{
                  player= 2;
                }
                roomId = id;
                break;
                }
          }

          exitRoom(roomId, player);
          if(player === 1){
            io.to(roomId).emit("player-1-discconected");
          }else{
            io.to(roomId).emit("player-2-disconnected");
          }
      }
    })

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





