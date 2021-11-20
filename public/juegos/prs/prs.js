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
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissor = document.getElementById("scissor");
const myScore = document.getElementById('my-score');
const enemyScore = document.getElementById('enemy-score');
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");

let canChoose = false;
let playerOneConnected = false;
let playerTwoConnected = false;
let playerId = 0; 
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints =0;
let enemyScorePoints =0;

openCreateRoomBox.addEventListener("click" , function(){
    gameplayChoices.style.display = "none";
    createRoomBox.style.display = "block";
})

cancelCreateActionBtn.addEventListener("click", function(){
    gameplayChoices.style.display = "none";
    createRoomBox.style.display = "block";
})
createRoomBtn.addEventListener("click", function(){
    let id = roomIdInput.value;

    errorMessage.innerText = "";
    errorMessage.style.display = "none";

    socket.emit("create-room", id);
})

//Socket
socket.on("display-error",error =>{
    errorMessage.style.display = "block";
    let p = document.createElement("p");
    p.innerHTML = error;
    errorMessage.appendChild(p);
})

socket.on("room-created",roomId =>{
    playerId = 1;
    roomId = id;
    setPlayerTag(1);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
})


//Funciones

function setPlayerTag(playerId){
    if(playerId===1){
        playerOneTag.innerText = "You (Player 1)";
        playerTwoTag.innerText = "Enemmy (Player 2) ";
    }else{
        playerOneTag.innerText = "Enemy (Player 2)";
        playerTwoTag.innerText = "You (Player 1)";
    }
}

function playerJoinTheGame(playerId){
    if(playerId === 1){
        playerOne.classList.add("connected");
    }else{
        playerTwo.classList.add("connected");

    }
}