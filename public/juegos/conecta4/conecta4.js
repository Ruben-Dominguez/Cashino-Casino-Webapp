document.addEventListener('DOMContentLoaded', () => {
    let user = sessionStorage.getItem('username');
    let wongbucksAmount = sessionStorage.getItem('wongbucks');

    let username = document.querySelector('#usernameLabel');
    let wongbucks = document.querySelector('#wongbucksLabel');

    username.innerHTML = `Username: ${user}`;
    wongbucks.innerHTML = `Wongbucks: $${wongbucksAmount}`;
});

const socket = io();


var tableRow = document.getElementsByTagName('tr');
var tableData = document.getElementsByTagName('td');
var playerTurn = document.querySelector('.player-turn');
const slots = document.querySelectorAll('.slot');
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints = 0;
let enemyScorePoints = 0;
