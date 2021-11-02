const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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
          let user = await users.find({username: cuenta.username,  password: cuenta.password});
          // await user.forEach(console.dir);
          socket.emit('cuentaCorrecta', {message: "Cuenta correcta"});


        } else {
          socket.emit('cuentaIncorrecta', {message: "Cuenta no encontrada, intente de nuevo"});
        }

      } finally {
        await client.close();
      }
    }

  });

});





