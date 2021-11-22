document.addEventListener('DOMContentLoaded', () => {
    let user = sessionStorage.getItem('username');
    let wongbucksAmount = sessionStorage.getItem('wongbucks');

    let username = document.querySelector('#usernameLabel');
    let wongbucks = document.querySelector('#wongbucksLabel');

    username.innerHTML = `Username: ${user}`;
    wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;
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
const startScreen = document.querySelector(".start-screen");
const cancelJoinActionBtn = document.getElementById("cancel-join-action");
const joinBoxRoom = document.getElementById("join-room-box");
const joinRoomBtn = document.getElementById("join-room-btn");
const joinRoomInput = document.getElementById("join-room-input");
const joinRandomBtn = document.getElementById("join-random");
const errorMessage = document.getElementById("error-message");
const playerOne = document.getElementById("player-1");
const playerTwo = document.getElementById("player-2");
const waitMessage = document.getElementById("wait-message");
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");


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
    createRoomBox.style.display = "block";
})

cancelCreateActionBtn.addEventListener("click", function(){
    gameplayChoices.style.display = "block";
    createRoomBox.style.display = "none";
})

createRoomBtn.addEventListener("click", function(){
    let id = roomIdInput.value;

    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    //let user = sessionStorage.getItem('username');
    socket.emit("create-room", id);
})

openJoinRoomBox.addEventListener("click", function(){
    gameplayChoices.style.display = "none";
    joinBoxRoom.style.display = "block";
})

cancelJoinActionBtn.addEventListener("click", function(){
    gameplayChoices.style.display = "block";
    joinBoxRoom.style.display = "none";
})

joinRoomBtn.addEventListener("click", function(){
    let id = joinRoomInput.value;
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    //let user = sessionStorage.getItem('username');
    socket.emit("join-room", id);
})

joinRandomBtn.addEventListener("click", function(){
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    socket.emit("join-random");
})


// Socket
socket.on("display-error", error => {
    errorMessage.style.display = "block";
    let p = document.createElement("p");
    p.innerHTML = error;
    errorMessage.appendChild(p);

})

socket.on("room-created", id => {
    playerId = 1;
    roomId = id;

    setPlayerTag(1);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
    //let user = sessionStorage.getItem('username');
    //socket.emit('ppt-fee', user);
})

socket.on("room-joined", id => {
    playerId = 2;
    roomId = id;

    playerOneConnected = true;
    playerJoinTheGame(1)
    setPlayerTag(2);
    setWaitMessage(false);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
    let user = sessionStorage.getItem('username');
    socket.emit('ppt-fee', user);
})

socket.on("player-1-connected", () => {
    playerJoinTheGame(1);
    playerOneConnected = true;
})

socket.on("player-2-connected", () => {
    playerJoinTheGame(2)
    playerTwoIsConnected = true
    canChoose = true;
    setWaitMessage(false);
});

socket.on("player-1-disconnected", () => {
    reset()
})

socket.on("player-2-disconnected", () => {
    canChoose = false;
    playerTwoLeftTheGame()
    setWaitMessage(true);
})

socket.on("draw", message => {
    setWinningMessage(message);
})

socket.on("player-1-wins", () => {
    if(playerId === 1){
        let message = "win!";
        setWinningMessage(message);

            let user = sessionStorage.getItem('username');
            setWinningMessage("Ganador");
            setTimeout(() => {
                socket.emit('ppt-winner', {user,roomId});
            }, 2500)
    }else{
        let message = "lose!";
        setWinningMessage(message);
    }

})

socket.on("player-2-wins", () => {
    if(playerId === 2){
        let message = "win!";
        setWinningMessage(message);

            let user = sessionStorage.getItem('username');
            setWinningMessage("Ganador");
            setTimeout(() => {
                socket.emit('ppt-winner', {user,roomId});
            }, 2500)
    }else{
        let message = "lose!";
        setWinningMessage(message);
    }

})

socket.on("red", ({column, j}) =>{
  tableRow[j].children[column].style.backgroundColor = '#8F0A0A';
  if (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()){
      socket.emit("win", {playerId, roomId})
      ///playerTurn.textContent = `${player1} WINS!!`;
      ///playerTurn.style.color = player1Color;
      //return alert(`${player1} WINS!!`);
  }else if (drawCheck()){
      socket.emit("draw", {playerId, roomId})
      ///playerTurn.textContent = 'DRAW!';
      ///return alert('DRAW!');
  }
})

socket.on("yellow", ({column, j}) =>{
  tableRow[j].children[column].style.backgroundColor = '#ECFF5E';
  if (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()){
      socket.emit("win", {playerId, roomId})
      ///playerTurn.textContent = `${player1} WINS!!`;
      ///playerTurn.style.color = player1Color;
      //return alert(`${player1} WINS!!`);
  }else if (drawCheck()){
      socket.emit("draw", {playerId, roomId})
      ///playerTurn.textContent = 'DRAW!';
      ///return alert('DRAW!');
  }
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


function setWinningMessage(message){
    let p  = document.createElement("p");
    p.innerText = message;

    winMessage.appendChild(p);

    setTimeout(() => {
        winMessage.innerHTML = "";
    }, 2500)
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
