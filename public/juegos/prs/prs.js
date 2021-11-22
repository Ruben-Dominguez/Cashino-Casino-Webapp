
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
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissor = document.getElementById("scissor");
const myScore = document.getElementById('my-score');
const enemyScore = document.getElementById('enemy-score');
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");
const btnBack = document.querySelector('button');

//  Game variables
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints = 0;
let enemyScorePoints = 0;



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
    socket.emit("create-room", id, user);
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
    socket.emit("join-room", id, user);
})

joinRandomBtn.addEventListener("click", function(){
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    let user = sessionStorage.getItem('username');
    socket.emit("join-random", user);
})

rock.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "rock";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
})

paper.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "paper";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
})

scissor.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "scissor";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
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
    let user = sessionStorage.getItem('username');
    socket.emit('ppt-fee', user);
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
    location.reload();
})

socket.on("player-2-disconnected", () => {
    canChoose = false;
    playerTwoLeftTheGame()
    setWaitMessage(true);
    enemyScorePoints = 0
    myScorePoints = 0
    displayScore()
    location.reload();
})

socket.on("draw", message => {
    setWinningMessage(message);
})

socket.on("player-1-wins", () => {
    if(playerId === 1){
        let message = "win!";
        setWinningMessage(message);
        myScorePoints++;
        if(myScorePoints >= 2){
            let user = sessionStorage.getItem('username');
            setWinningMessage("Ganador");
            let wongbucksAmount = parseInt(sessionStorage.getItem('wongbucks'));
            console.log("webos");
            sessionStorage.setItem('wongbucks', wongbucksAmount + 300);
            setTimeout(() => {
                socket.emit('ppt-winner', {user,roomId});
            }, 2500)
        }
    }else{
        let message = "lose!";
        setWinningMessage(message); 
        enemyScorePoints++;
        if(enemyScorePoints >= 2){
            setWinningMessage("Loser");
        } 
    }

    displayScore()
})

socket.on("player-2-wins", () => {
    if(playerId === 2){
        let message = "win!";
        setWinningMessage(message);
        myScorePoints++;
        if(myScorePoints >= 2){
            let user = sessionStorage.getItem('username');
            setWinningMessage("Ganador");
            console.log("webos");
            setTimeout(() => {
                socket.emit('ppt-winner', {user,roomId});
            }, 2500)
        } 
    }else{
        let message = "lose!";
        setWinningMessage(message); 
        enemyScorePoints++;
        if(enemyScorePoints >= 2){
            //let user = sessionStorage.getItem('username');
            setWinningMessage("Loser");
            //socket.emit('ppt-loser', user);
        } 
    }

    displayScore()
})

socket.on("actualizar-ppt", obj => {
    let wongbucksAmount = sessionStorage.setItem('wongbucks', obj.wongbucks);
    console.log(wongbucksAmount);
    let wongbucks = document.querySelector('#wongbucksLabel');
    wongbucks.innerHTML = `Wongbucks: $${sessionStorage.getItem('wongbucks')}`;
});

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

function reset(){
    canChoose = false;
    playerOneConnected = false;
    playerTwoIsConnected = false;
    startScreen.style.display = "block";
    gameplayChoices.style.display = "block";
    gameplayScreen.style.display = "none";
    joinBoxRoom.style.display = "none";
    createRoomBox.style.display = "none";
    playerTwo.classList.remove("connected");
    playerOne.classList.remove("connected");
    myScorePoints = 0;
    enemyScorePoints = 0;
    displayScore();
    setWaitMessage(true);
}

function playerTwoLeftTheGame(){
    playerTwoIsConnected = false;
    playerTwo.classList.remove("connected");
}

function displayScore(){
    myScore.innerText = myScorePoints;
    enemyScore.innerText = enemyScorePoints;
}

function choose(choice){
    if(choice === "rock"){
        rock.classList.add("my-choice");
    }else if(choice === "paper"){
        paper.classList.add("my-choice");
    }else{
        scissor.classList.add("my-choice");
    }
    canChoose = false;
}

function removeChoice(choice){
    if(choice === "rock"){
        rock.classList.remove("my-choice");
    }else if(choice === "paper"){
        paper.classList.remove("my-choice");
    }else{
        scissor.classList.remove("my-choice");
    }

    canChoose = true;
    myChoice = "";
}

function setWinningMessage(message){
    let p  = document.createElement("p");
    p.innerText = message;

    winMessage.appendChild(p);

    setTimeout(() => {
        removeChoice(myChoice)
        winMessage.innerHTML = "";
    }, 2500)
}
