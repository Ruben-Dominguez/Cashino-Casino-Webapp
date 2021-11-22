document.addEventListener('DOMContentLoaded', () => {
    let user = sessionStorage.getItem('username');
    let wongbucksAmount = sessionStorage.getItem('wongbucks');

    let username = document.querySelector('#usernameLabel');
    let wongbucks = document.querySelector('#wongbucksLabel');

    username.innerHTML = `Username: ${user}`;
    wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;

    if(sessionStorage.getItem("username") == "null" || sessionStorage.getItem("username") == null) {
        window.location.href = "../../lobby/error.html";
    }

    let logout = document.getElementById("logout");

  // logout que borre la sesion y te regrese al menu principal
    logout.addEventListener("click", ()=>{
        sessionStorage.setItem("username", null);
        sessionStorage.setItem("wongbucks", null);
    });
});

const socket = io();

// DOM Elements
const openCreateRoomBox = document.getElementById("open-create-room-box");
const openJoinRoomBox = document.getElementById("open-join-room-box");
const createRoomBox = document.getElementById("create-room-box");
const roomIdInput = document.getElementById("room-id");
const cancelCreateActionBtn = document.getElementById("cancel-create-action");
const gameplayChoices = document.getElementById("gameplay-choices");
const createRoomBtn = document.getElementById("create-room-btn");
const gameplayScreen = document.querySelector(".gameplay-screen");
const grid = document.querySelector(".conecta4-container")
const startScreen = document.querySelector(".start-screen");
const cancelJoinActionBtn = document.getElementById("cancel-join-action");
const joinBoxRoom = document.getElementById("join-room-box");
const joinRoomBtn = document.getElementById("join-room-btn");
const joinRoomInput = document.getElementById("join-room-input");

const errorMessage = document.getElementById("error-message");
const playerOne = document.getElementById("player-1");
const playerTwo = document.getElementById("player-2");
const waitMessage = document.getElementById("wait-message");
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");
const turn = document.getElementById("player-turn");


var tableRow = document.getElementsByTagName('tr');
var tableData = document.getElementsByTagName('td');
var playerTurn = document.querySelector('.player-turn');
const slots = document.querySelectorAll('.slot');
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let roomId = "";
let row;



for (i = 0; i < tableData.length; i ++){
    tableData[i].addEventListener('click', (e) =>{
      console.log(`${e.target.parentElement.rowIndex},${e.target.cellIndex}`)
      changeColor(e);
    });
};

function changeColor(e){
  let column = e.target.cellIndex;
  for (j = 5; j > -1; j--){
    console.log(`${tableRow[j].children[column].style.backgroundColor}`)
    if (tableRow[j].children[column].style.backgroundColor == 'white'){
      row = tableRow[j].children[column];
      console.log(`${row.style.backgroundColor}`)
      socket.emit("move", {playerId, column, j, roomId})
      break;
    }
  }

}

Array.prototype.forEach.call(tableData, (cell) => {
    cell.style.backgroundColor = 'white';
});

//Array.prototype.forEach.call(tableData, (cell) => {
//    cell.addEventListener('click', changeColor);
//});

openCreateRoomBox.addEventListener("click", function(){
    gameplayChoices.style.display = "none";
    createRoomBox.style.display = "flex";
})

cancelCreateActionBtn.addEventListener("click", function(){
    gameplayChoices.style.display = "flex";
    createRoomBox.style.display = "none";
})

createRoomBtn.addEventListener("click", function(){
    let id = roomIdInput.value;

    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    let user = sessionStorage.getItem('username');
    socket.emit("create-room4", id, user);
})

openJoinRoomBox.addEventListener("click", function(){
    gameplayChoices.style.display = "none";
    joinBoxRoom.style.display = "flex";
})

cancelJoinActionBtn.addEventListener("click", function(){
    gameplayChoices.style.display = "flex";
    joinBoxRoom.style.display = "none";
})

joinRoomBtn.addEventListener("click", function(){
    let id = joinRoomInput.value;
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    let user = sessionStorage.getItem('username');
    socket.emit("join-room4", id, user);
})




// Socket
socket.on("disply-error", error => {
    errorMessage.style.display = "block";
    let p = document.createElement("p");
    p.innerHTML = error;
    errorMessage.appendChild(p);

})

socket.on("rom-created", id => {
    playerId = 1;
    roomId = id;

    setPlayerTag(1);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
    grid.style.display = "block";

    let user = sessionStorage.getItem('username');
    socket.emit('conecta4-fee', user);
})

socket.on("rom-joined", id => {
    playerId = 2;
    roomId = id;

    playerOneConnected = true;
    playerJoinTheGame(1)
    setPlayerTag(2);
    setWaitMessage(false);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
    grid.style.display = "block";
    let user = sessionStorage.getItem('username');
    socket.emit('conecta4-fee', user);
})

socket.on("playr-1-connected", () => {
    playerJoinTheGame(1);
    playerOneConnected = true;
})

socket.on("playr-2-connected", () => {
    playerJoinTheGame(2)
    playerTwoIsConnected = true
    canChoose = true;
    setWaitMessage(false);
});

socket.on("ending", () => {
  setTimeout(() => {
    location.reload();
  }, 2500)
})

socket.on("plyer-1-disconnected", () => {
    turn.innerHTML = "El jugador uno se desconecto"
  setTimeout(() => {
    location.reload();
  }, 2500)
})

socket.on("plyer-2-disconnected", () => {
  turn.innerHTML = "El jugador dos se desconecto"
  setTimeout(() => {
    location.reload();
  }, 2500)
})

socket.on("plyer-1-wins", () => {
    if(playerId === 2){
      turn.innerHTML = "You Lose";
      turn.style.color = '#8F0A0A';
    }else{
      turn.innerHTML = "Ganador";
      turn.style.color = '#ECFF5E';

      let user = sessionStorage.getItem('username');
      setTimeout(() => {
        socket.emit('conecta4-winner', {user,roomId});
      }, 2500)
    }

})

socket.on("plyer-2-wins", () => {
    if(playerId === 1){
      turn.innerHTML = "You Lose";
      turn.style.color = '#ECFF5E';
    }else{
      turn.innerHTML = "Ganador";
      turn.style.color = '#8F0A0A';

      let user = sessionStorage.getItem('username');
      setTimeout(() => {
        socket.emit('conecta4-winner', {user,roomId});
      }, 2500)
    }

})

socket.on("actualizar-conecta4", obj => {
    let wongbucksAmount = sessionStorage.setItem('wongbucks', obj.wongbucks);
    console.log(wongbucksAmount);
    let wongbucks = document.querySelector('#wongbucksLabel');
    wongbucks.innerHTML = `Wongbucks: $${sessionStorage.getItem('wongbucks')}`;
});


socket.on("red", ({column, j}) =>{
  tableRow[j].children[column].style.backgroundColor = '#8F0A0A';
  if (playerId == 2 && (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2())){
      socket.emit("win", {playerId, roomId})
  }else if (drawCheck()){
    turn.innerHTML = "Empate";
    turn.style.color = 'black';
    let user = sessionStorage.getItem('username');
    socket.emit("draw", {user, roomId})
  }
  else{
    turn.innerHTML = "Turno del jugador Amarillo";
    turn.style.color = '#ECFF5E';
  }
})

socket.on("yellow", ({column, j}) =>{
  tableRow[j].children[column].style.backgroundColor = '#ECFF5E';
  if (playerId == 1 && (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2())){
      socket.emit("win", {playerId, roomId})
  }else if (drawCheck()){
    turn.innerHTML = "Empate";
    turn.style.color = 'black';
    let user = sessionStorage.getItem('username');
    socket.emit("draw", {user, roomId})
  }
  else{
    turn.innerHTML = "Turno del jugador Rojo";
    turn.style.color = '#8F0A0A';
  }
})

socket.on("error", () => {
  window.location.href = "../../lobby/error.html";
})

// Functions
function setPlayerTag(playerId){
    if(playerId === 1){
        playerOneTag.innerText = "You (Player 1)";
        playerTwoTag.innerText = "Enemy (Player 2)";
    }else{
        playerOneTag.innerText = "Enemy (Player 1)";
        playerTwoTag.innerText = "You (Player 2)";
    }
}

function playerJoinTheGame(playerId){
    if(playerId === 1){
        playerOne.classList.add("connected");
    }else{
        playerTwo.classList.add("connected");
    }
}

function setWaitMessage(display){
    if(display){
        let p = document.createElement("p");
        p.innerText = "Esperando al otro jugador...";
        waitMessage.appendChild(p)
    }else{
        waitMessage.innerHTML = "";
    }
}


function playerTwoLeftTheGame(){
    playerTwoIsConnected = false;
    playerTwo.classList.remove("connected");
}

function colorMatchCheck(one, two, three, four){
    return (one === two && one === three && one === four && one !== 'white' && one !== undefined);
}

function horizontalCheck(){
    for (let row = 0; row < tableRow.length; row++){
        for (let col =0; col < 4; col++){
           if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor,tableRow[row].children[col+1].style.backgroundColor,
                                tableRow[row].children[col+2].style.backgroundColor, tableRow[row].children[col+3].style.backgroundColor)){
               return true;
           }
        }
    }
}

function verticalCheck(){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 3; row++){
            if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row+1].children[col].style.backgroundColor,
                                tableRow[row+2].children[col].style.backgroundColor,tableRow[row+3].children[col].style.backgroundColor)){
                return true;
            };
        }
    }
}

function diagonalCheck(){
    for(let col = 0; col < 4; col++){
        for (let row = 0; row < 3; row++){
            if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row+1].children[col+1].style.backgroundColor,
                tableRow[row+2].children[col+2].style.backgroundColor,tableRow[row+3].children[col+3].style.backgroundColor)){
                    return true;
                }
            }
        }

}

function diagonalCheck2(){
    for(let col = 0; col < 4; col++){
        for (let row = 5; row > 2; row--){
            if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row-1].children[col+1].style.backgroundColor,
                tableRow[row-2].children[col+2].style.backgroundColor,tableRow[row-3].children[col+3].style.backgroundColor)){
                    return true;
            }
        }
    }
}

function drawCheck(){
    let fullSlot = []
    for (i=0; i < tableData.length; i++){
        if (tableData[i].style.backgroundColor !== 'white'){
            fullSlot.push(tableData[i]);
        }
    }
    if (fullSlot.length === tableData.length){
        return true;
    }
}
