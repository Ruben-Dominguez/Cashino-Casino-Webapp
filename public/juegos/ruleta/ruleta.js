document.addEventListener('DOMContentLoaded', () => {

  // NAVBAR
  let user = sessionStorage.getItem('username');
  let wongbucksAmount = sessionStorage.getItem('wongbucks');

  let username = document.querySelector('#usernameLabel');
  let wongbucks = document.querySelector('#wongbucksLabel');

  username.innerHTML = `Username: ${user}`;
  wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;

  // END NAVBAR


  const socket = io();

  // Globales
  let seleccion = null;
  let numeroGanador = null;
  let resultado = null;
  let first18 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  let last18 = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
  let reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  let blacks = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
  let odd = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
  let even = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
  let first12 = [1,2,3,4,5,6,7,8,9,10,11,12];
  let middle12 = [13,14,15,16,17,18,19,20,21,22,23,24];
  let last12 = [25,26,27,28,29,30,31,32,33,34,35,36];
  let row1 = [3,6,9,12,15,18,21,24,27,30,33,36];
  let row2 = [2,5,8,11,14,17,20,23,26,29,32,35];
  let row3 = [1,4,7,10,13,16,19,22,25,28,31,34];

  let apuesta = document.querySelector("#apuestaRuleta");
  let seleccionables = document.querySelectorAll(".seleccionable");
  let apostar = document.querySelector("#apostarBtn");
  let ruleta = document.querySelector("#ruletaCompleta");
  let ganador = document.querySelector(".ganador");
  let perdedor = document.querySelector(".perdedor");
  let logout = document.getElementById("logout");

  // logout que borre la sesion y te regrese al menu principal
  logout.addEventListener("click", ()=>{
    sessionStorage.setItem("username", null);
    sessionStorage.setItem("wongbucks", null);
  });

  if(sessionStorage.getItem("username") == "null") {
    window.location.href = "./error.html";
  }

  // for para la seleccion de casilla en el tablero
  seleccionables.forEach(seleccionable => {

    // en click hacer que se deseleccione la otra casilla y seleccionar la nueva
    seleccionable.addEventListener("click", () => {

      // deseleccion de casilla
      seleccionables.forEach(marcado => {

        // buscar por color la casilla amarilla
        if(marcado.style.background == "yellow"){
          if(marcado.classList.contains("verde")){
            marcado.style.background = "#56b602";
          } else if(marcado.classList.contains("rojo")) {
            marcado.style.background = "#e40606";
          } else if(marcado.classList.contains("negro")) {
            marcado.style.background = "#181818";
          } else {
            marcado.style.background = "#0f6c00";
          }
        }
      });
      // seleccion de casilla
      seleccionable.style.background = "yellow";
      seleccion = seleccionable;
      // console.log(seleccion);
    });
  });

  // evento en click activar la rotacion de la ruleta y seleccionar el payout correspondiente
  apostar.addEventListener("click", () => {
    // acaba, puesto que la cantidad es incorrecta
    if(parseInt(sessionStorage.getItem("wongbucks")) < apuesta.value || apuesta.value <= 0) {
      alert(`Cantidad no valida`);
      return;
    }

    // verificador de casillas marcadas
    let marcado = false;
    seleccionables.forEach(casilla => {
      if(casilla.style.background == "yellow") {
        marcado = true;
      }
    });

    // si no hay casilla marcada se sale
    if(!marcado) {
      alert("Por favor seleccione una casilla en el tablero");
      return;
    }

    if(apostar.innerHTML == "Apostar" || apostar.innerHTML == "Apostar de nuevo")
      apostar.classList.add("disable");

    let anguloRandom = Math.random() * 360; // 0- 359
    ruleta.classList.toggle("girarRuleta");
    if(ruleta.classList.contains("girarRuleta")) {
      document.querySelector(".girarRuleta").style.setProperty("--ang", `${anguloRandom+1800}deg`);
      apostar.innerHTML = "Resetear";

      // console.log(anguloRandom);
    if(anguloRandom >= 355.135 && anguloRandom < 360 || anguloRandom >= 0 && anguloRandom < 4.865) {
      numeroGanador = 0;
    } else if (anguloRandom >= 4.865 && anguloRandom < 14.595) {
      numeroGanador = 26;
    } else if (anguloRandom >= 14.595 && anguloRandom < 24.325) {
      numeroGanador = 3;
    } else if (anguloRandom >= 24.325 && anguloRandom < 34.055) {
      numeroGanador = 35;
    } else if (anguloRandom >= 34.055 && anguloRandom < 43.785) {
      numeroGanador = 12;
    } else if (anguloRandom >= 43.785 && anguloRandom < 53.515) {
      numeroGanador = 28;
    } else if (anguloRandom >= 53.515 && anguloRandom < 63.245) {
      numeroGanador = 7;
    } else if (anguloRandom >= 63.245 && anguloRandom < 72.975) {
      numeroGanador = 29;
    } else if (anguloRandom >= 72.975 && anguloRandom < 82.705) {
      numeroGanador = 18;
    } else if (anguloRandom >= 82.705 && anguloRandom < 92.435) {
      numeroGanador = 22;
    } else if (anguloRandom >= 92.435 && anguloRandom < 102.165) {
      numeroGanador = 9;
    } else if (anguloRandom >= 102.165 && anguloRandom < 111.895) {
      numeroGanador = 31;
    } else if (anguloRandom >= 111.895 && anguloRandom < 121.625) {
      numeroGanador = 14;
    } else if (anguloRandom >= 121.625 && anguloRandom < 131.355) {
      numeroGanador = 20;
    } else if (anguloRandom >= 131.355 && anguloRandom < 141.085) {
      numeroGanador = 1;
    } else if (anguloRandom >= 141.085 && anguloRandom < 150.815) {
      numeroGanador = 33;
    } else if (anguloRandom >= 150.815 && anguloRandom < 160.545) {
      numeroGanador = 16;
    } else if (anguloRandom >= 160.545 && anguloRandom < 170.275) {
      numeroGanador = 24;
    } else if (anguloRandom >= 170.275 && anguloRandom < 180.005) {
      numeroGanador = 5;
    } else if (anguloRandom >= 180.005 && anguloRandom < 189.735) {
      numeroGanador = 10;
    } else if (anguloRandom >= 189.735 && anguloRandom < 199.465) {
      numeroGanador = 23;
    } else if (anguloRandom >= 199.465 && anguloRandom < 209.195) {
      numeroGanador = 8;
    } else if (anguloRandom >= 209.195 && anguloRandom < 218.925) {
      numeroGanador = 30;
    } else if (anguloRandom >= 218.925 && anguloRandom < 228.655) {
      numeroGanador = 11;
    } else if (anguloRandom >= 228.655 && anguloRandom < 238.385) {
      numeroGanador = 36;
    } else if (anguloRandom >= 238.385 && anguloRandom < 248.115) {
      numeroGanador = 13;
    } else if (anguloRandom >= 248.115 && anguloRandom < 257.845) {
      numeroGanador = 21;
    } else if (anguloRandom >= 257.845 && anguloRandom < 267.575) {
      numeroGanador = 6;
    } else if (anguloRandom >= 267.575 && anguloRandom < 277.305) {
      numeroGanador = 34;
    } else if (anguloRandom >= 277.305 && anguloRandom < 287.035) {
      numeroGanador = 17;
    } else if (anguloRandom >= 287.035 && anguloRandom < 296.765) {
      numeroGanador = 25;
    } else if (anguloRandom >= 296.765 && anguloRandom < 306.495) {
      numeroGanador = 2;
    } else if (anguloRandom >= 306.495 && anguloRandom < 316.225) {
      numeroGanador = 21;
    } else if (anguloRandom >= 316.225 && anguloRandom < 325.955) {
      numeroGanador = 4;
    } else if (anguloRandom >= 325.955 && anguloRandom < 335.685) {
      numeroGanador = 19;
    } else if (anguloRandom >= 335.685 && anguloRandom < 345.415) {
      numeroGanador = 15;
    } else if (anguloRandom >= 345.415 && anguloRandom < 355.135) {
      numeroGanador = 32;
    }

    if(seleccion.innerHTML == 0 && numeroGanador == 0) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 1 && numeroGanador == 1) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 2 && numeroGanador == 2) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 3 && numeroGanador == 3) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 4 && numeroGanador == 4) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 5 && numeroGanador == 5) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 6 && numeroGanador == 6) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 7 && numeroGanador == 7) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 8 && numeroGanador == 8) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 9 && numeroGanador == 9) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 10 && numeroGanador == 10) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 11 && numeroGanador == 11) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 12 && numeroGanador == 12) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 13 && numeroGanador == 13) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 14 && numeroGanador == 14) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 15 && numeroGanador == 15) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 16 && numeroGanador == 16) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 17 && numeroGanador == 17) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 18 && numeroGanador == 18) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 19 && numeroGanador == 19) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 20 && numeroGanador == 20) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 21 && numeroGanador == 21) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 22 && numeroGanador == 22) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 23 && numeroGanador == 23) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 24 && numeroGanador == 24) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 25 && numeroGanador == 25) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 26 && numeroGanador == 26) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 27 && numeroGanador == 27) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 28 && numeroGanador == 28) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 29 && numeroGanador == 29) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 30 && numeroGanador == 30) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 31 && numeroGanador == 31) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 32 && numeroGanador == 32) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 33 && numeroGanador == 33) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 34 && numeroGanador == 34) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 35 && numeroGanador == 35) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == 36 && numeroGanador == 36) {
      resultado = apuesta.value * 35;
    } else if(seleccion.innerHTML == "1-12" && first12.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "13-24" && middle12.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "25-36" && last12.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "1row" && row1.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "2row" && row2.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "3row" && row3.includes(numeroGanador)) {
      resultado = apuesta.value * 2;
    } else if(seleccion.innerHTML == "1-18" && first18.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else if(seleccion.innerHTML == "19-36" && last18.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else if(seleccion.innerHTML == "RED" && reds.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else if(seleccion.innerHTML == "BLACK" && blacks.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else if(seleccion.innerHTML == "EVEN" && even.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else if(seleccion.innerHTML == "ODD" && odd.includes(numeroGanador)) {
      resultado = parseInt(apuesta.value);
    } else {
      resultado = -1 *parseInt(apuesta.value);
    }

    // console.log(numeroGanador);
    // console.log(resultado);

    socket.emit("ruletaResultado", {user: user, amount: parseInt(resultado)});

    socket.on("actualizarRuleta", obj => {
      setTimeout(() => {
        wongbucksAmount = sessionStorage.setItem('wongbucks', obj.wongbucks);
        wongbucks.innerHTML = `Wongbucks: $${sessionStorage.getItem('wongbucks')}`;

        if(resultado > 0) {
          ganador.innerHTML = `Ganaste $${parseInt(resultado)}`;
          ganador.disable = false;
          ganador.classList.add("mostrar");
        } else {
          perdedor.innerHTML = `Perdiste $${-1*resultado}`;
          perdedor.disable = false;
          perdedor.classList.add("mostrar");
        }

        setTimeout(() => {
          if(resultado > 0) {
            ganador.innerHTML = "";
            ganador.classList.remove("mostrar");
            ganador.disable = true;
          } else {
            perdedor.innerHTML = "";
            perdedor.classList.remove("mostrar");
            perdedor.disable = true;
          }
          apostar.classList.remove("disable") ;
        }, 2000);

      }, 4500);
      
    });

    } else {
      apostar.innerHTML = "Apostar de nuevo";
    }
    
  });

});