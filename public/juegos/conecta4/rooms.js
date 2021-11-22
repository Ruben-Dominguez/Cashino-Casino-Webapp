const rooms = {};

const createRoom = (roomId, player1Id,type) => {
    rooms[roomId] = [player1Id, ""];
    rooms[roomId].currentPlayer = 1;
    rooms[roomId].players = 1;
    rooms[roomId].type = type;
}

const joinRoom = (roomId, player2Id) => {
    rooms[roomId][1] = player2Id;
    rooms[roomId].players++;
}

const exitRoom = (roomId, player) => {
    if(player === 1){
        delete rooms[roomId];
    }
    else if(!(typeof roomId == 'undefined')){
        rooms[roomId][1] = "";
    }
}

module.exports = {rooms, createRoom, joinRoom, exitRoom};
