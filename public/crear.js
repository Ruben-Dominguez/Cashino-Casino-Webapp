document.addEventListener('DOMContentLoaded', () => {
  let username = document.querySelector('#usernameText');
  let password = document.querySelector('#passwordText');
  let crearCuenta = document.querySelector('#crearCuentaBtn');
  let atras = document.getElementById('atras');

  atras.addEventListener('click', () => {
    window.location.href = "/";
  })

  // Sockets
  const socket = io();

  // listener que tiene el boton de crear cuenta, se activa en click
  crearCuenta.addEventListener('click', () => {
    // comprobaciones de vacio y de tamanio
    if(username.value == "") {
      alert("Nombre de usuario no valido, no se permiten vacios");
    } else if(password.value == "") {
      alert("Password no valido, no se permiten vacios");
    } else {
      if(password.value.length < 8) {
        alert("Password no valido, requiere un minimo de 8 caracteres");
      }
      else if(password.value.length > 20) {
        alert("Password no valido, sobrepasa el maximo de 20 caracteres");
      }
      else {
        socket.emit('cuenta-nueva', {username: username.value, password: password.value});
      }
    } 
  });

  socket.on('cuenta-correcta', obj => {
    username.value = "";
    password.value = "";
    alert(`${obj.message}\nRedireccionando a Inicio de Sesion`);
    window.location.href = "./iniciar.html";
  });

  socket.on('error-cuenta-ya-registrada', obj => {
    alert(obj.message);
  });

});

