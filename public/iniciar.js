document.addEventListener('DOMContentLoaded', () => {
  let username = document.querySelector('#usernameText');
  let password = document.querySelector('#passwordText');
  let iniciar = document.querySelector('#iniciarBtn');

  // console.log(sessionStorage.getItem('username'), sessionStorage.getItem('password'));

  // Sockets
  const socket = io();

  // listener que tiene el boton de iniciar sesion, se activa en click
  iniciar.addEventListener('click', () => {
    socket.emit('iniciarSesion', {username: username.value, password: password.value});
  });

  socket.on('cuentaCorrecta', obj => {
    if(sessionStorage.getItem('username') == username.value && sessionStorage.getItem('password') == password.value) {
      
      sessionStorage.setItem('wongbucks', obj.userFound.wongbucks);

      // ya guardado do something
    } else {
      sessionStorage.setItem('username', username.value);
      sessionStorage.setItem('password', password.value);
      sessionStorage.setItem('wongbucks', obj.userFound.wongbucks);
    }
    
    // resetea los valores
    username.value = "";
    password.value = "";

    // da alerta al mensaje
    alert(obj.message);
    window.location.href = "./lobby/juegos.html";
  });

  socket.on('cuentaIncorrecta', obj => {
    alert(obj.message);
  });
  

});

