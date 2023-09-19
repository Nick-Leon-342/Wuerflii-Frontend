

function handleConnection(socket) {


    //____________________Registration____________________

    socket.on("registration", user => {

        const tmpUser = registration(user.Name, user.Password);
        users.push(tmpUser);
        socket.emit("registration", {Name: tmpUser.Name, Token: tmpUser.Token});
        save();

    })




    
    //____________________Login____________________

    socket.on("login", user => {
        
        const tmpUser = login(user.Name, user.Password);
        socket.emit("login", tmpUser !== "" ? {Name: tmpUser.Name, Token: tmpUser.Token} : "Error");
        save();

    })





    //____________________LoadSessions____________________

    socket.on("loadSessions", user => {

        const tmpUser = getUser(user.Name, user.Token);

        if(tmpUser != null) {
            if(tmpUser.SessionNames_List.length != 0) {
                socket.emit("loadSessions", {SessionNames_List: tmpUser.SessionNames_List, GameAttributes_List: tmpUser.GameAttributes_List, Players_List: tmpUser.Players_List});
            } else {
                socket.emit("loadSessions", null);
            }
        }

    })





    //____________________SaveResults____________________

    socket.on("sessionNameRequest", user => {

        const tmpUser = getUser(user.Name, user.Token);

        socket.emit("sessionNameRequest", generateSessionName(tmpUser.SessionNames_List));
        
    })

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





function generateSessionName(sessionNames_List) {

    let sessionName;
    
    for(let i = 0; sessionNames_List.length + 1 > i; i++) {
        sessionName = "gameSession_" + i;
        if(!sessionNames_List.includes(sessionName)) {break;}
    }

    sessionNames_List.push(sessionName);
    return sessionName;

}





















module.exports = {
    handleConnection
}