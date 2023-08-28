

function nextSelectKG() {
    document.getElementById("chooseKniffelGameList").innerHTML += "<dt class='listElement'><div class='nameOfPerson'>" + input.value + "</div><button class='xBtn'>X</button></dt>";
}



document.getElementById("chooseKniffelGameList").addEventListener("click", function(event) {
    
    const target = event.target;
    if(target.tagName !== "BUTTON") {
        
        const clickedElement = target.closest("dt");
        const gs = [...gameSessionList[clickedElement.getAttribute("gameSessionIndex")]];
        gameSessionList.length = 0;
        initGameSession(gs);

    } else {
        
        if (window.confirm("Bist du sicher, dass du diese Session löschen möchtest?")) {
            
            const gameSessionName = target.getAttribute("gameSessionName");
            const gsn_players = gameSessionName + players_Substring;
            const gsn_gameAttributes = gameSessionName + gameAttributes_Substring;
            const gsn_finalScore = gameSessionName + finalScore_Substring;
    
            
            //____________________GameSessionNames____________________
            const gameSessionNames = localStorage.getItem(localSession_NamesList_String) != null ? JSON.parse(localStorage.getItem(localSession_NamesList_String)) : [];
            gameSessionNames.splice(gameSessionNames.indexOf(gameSessionName), 1);
            localStorage.setItem(localSession_NamesList_String, JSON.stringify(gameSessionNames));
    
            localStorage.removeItem(gsn_players);
            localStorage.removeItem(gsn_gameAttributes);
            localStorage.removeItem(gsn_finalScore);
    
            loadAllGames();

        }

    }

});



function loadAllGames() {

    const gameSessionNames = JSON.parse(localStorage.getItem(localSession_NamesList_String));
    gameSessionList.length = 0;
    document.getElementById("chooseKniffelGameList").innerHTML = "";

    for(let i = 0; gameSessionNames.length > i; i++) {

        const players = JSON.parse(localStorage.getItem(gameSessionNames[i] + players_Substring));
        const gameAttributes = JSON.parse(localStorage.getItem(gameSessionNames[i] + gameAttributes_Substring));
        const tmp = [players, gameAttributes];
        gameSessionList.push(tmp);

        let elementPlayersNames = "";
        for(let i = 0; players.length > i; i++) {elementPlayersNames = elementPlayersNames.concat(players[i].Name + ((i+1) == players.length ? "" : " vs "));}

        document.getElementById("chooseKniffelGameList").innerHTML += "<dt class='listElement' gameSessionIndex='" + i + "'>" + 
            "<label class='listElement-label'>" + elementPlayersNames + "</label>" + 
            "<div class='listElement-container'>" + 
            "<label class='listElement-label'>" + gameAttributes.CreatedDate + "</label>" + 
            "<button class='deleteGameButton' gameSessionName='" + gameAttributes.SessionName + "'>X</button>" + 
            "</div>" + 
            "</dt>";
    }

    resizeEvent();

}
