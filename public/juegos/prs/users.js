const connectedusers = {};
const choices = {};
const moves ={ 
    "rock": "scissor",
    "paper": "rock",
    "scissor": "paper"
};

const initializeChoices = (roomId) =>{
    choices[roomId] =["", ""]
}

const userConnected = (userId) => {
    connectedusers[userId] = true;
}

const makeMove = (roomId,player, choice) =>{
    if(choices[roomId]){
        choices[roomId][player -1] = choice;
    }
}

module.exports = {moves,connectedusers, choices, initializeChoices, userConnected,makeMove};