document.addEventListener('DOMContentLoaded', () => {
  let username = document.querySelector('#usernameText');
  let password = document.querySelector('#passwordText');
  let iniciar = document.querySelector('#iniciarBtn');

  // Sockets
  const socket = io();

  // listener que tiene el boton de iniciar sesion, se activa en click
  iniciar.addEventListener('click', () => {
    socket.emit('iniciarSesion', {username: username.value, password: password.value});
    
  });

  socket.on('cuentaCorrecta', obj => {
    username.value = "";
    password.value = "";
    alert(obj.message);
    window.location.href = "./lobby/lobby.html";
  });

  socket.on('cuentaIncorrecta', obj => {
    alert(obj.message);
  });
  

});

