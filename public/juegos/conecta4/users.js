const connectedusers = {};

const userConnected = (userId) => {
    connectedusers[userId] = true;
}

const makeMove = (roomId, player, choice) =>{
    if(choices[roomId]){
        choices[roomId][player -1] = choice;
    }
}

module.exports = {connectedusers, userConnected, makeMove};
