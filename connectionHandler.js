

function handleConnection(socket) {

    socket.on("saveResults", user => {

        const tmpUser = getUser(user.User.Name, user.User.Token);

        const gameAttributes = user.GameAttributes;
        const players = user.Players;
        const finalScores = user.FinalScores;
        
        const sessionName = gameAttributes.SessionName;


        const tmpG = tmpUser.GameAttributes_List;

        for(let i = 0; tmpG.length > i; i++) {
            if(tmpG[i].SessionName == gameAttributes.SessionName) {
                tmpG[i] = gameAttributes;
                tmpUser.Players_List[i] = players;
                tmpUser.FinalScores_List[i].push(finalScores);
                save();
                return;
            }
        }
    
        tmpUser.GameAttributes_List.push(gameAttributes);
        tmpUser.Players_List.push(players);
        tmpUser.FinalScores_List.push([finalScores]);

        save();

    })





    //____________________FinalScoresRequest____________________

    socket.on("finalScoresRequest", user => {

        const tmpUser = getUser(user.Name, user.Token);
        const sessionName = user.SessionName;

        if(tmpUser != null) {socket.emit("finalScoresRequest", tmpUser.FinalScores_List[tmpUser.SessionNames_List.indexOf(sessionName)]);}

    })


}



























module.exports = {
    handleConnection
}