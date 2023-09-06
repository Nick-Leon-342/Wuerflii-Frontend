

//__________________________________________________Load all sessions when site is loaded__________________________________________________

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("application").style.display = "block";

    if(isTest()) {

        initTestData();

    }else {

        try {
            loadAllSessions();
        } catch(err) {
            nothingInList = true;
            loadError();
        }

    }    

}, false);

let nothingInList = false;





function initTestData() {

    const list = document.getElementById("sessionList");
    list.innerHTML = "";

    for(let i = 0; 3 > i; i++) {

        list.innerHTML += "<dt class='listElement'>" + 
            "<label class='listElement-label'>Player_0 vs Player_1 vs Player_2</label>" + 
            "<div class='listElement-container'>" + 
            "<label class='listElement-label'>02/11/2000</label>" + 
            "<button class='deleteGameButton'>X</button>" + 
            "</div>" + 
            "</dt>";

    }

}





function switchToEnterNameAndColumnCount() {

    window.location.href = "../kniffel.html";

}




document.getElementById("sessionList").addEventListener("click", function(event) {if(!nothingInList) {
    
    const target = event.target;
    if(target.tagName !== "BUTTON") {
        
        const clickedElement = target.closest("dt");
        const gs = gameSessionList[clickedElement.getAttribute("gameSessionIndex")];
        sessionStorage.setItem(sessionStorage_players, JSON.stringify(gs.Players));
        sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gs.GameAttributes));
        gameSessionList.length = 0;

        window.location.href = "../sessionpreview/sessionpreview.html";

    } else {
        
        if (window.confirm("Bist du sicher, dass du diese Session löschen möchtest?")) {
            
            const sessionName = target.getAttribute("gameSessionName");
            setTmpLocalStorageString(sessionName);
    
            
            //____________________GameSessionNames____________________
            const gameSessionNames = localStorage.getItem(localStorage_sessionName_List) != null ? JSON.parse(localStorage.getItem(localStorage_sessionName_List)) : [];
            gameSessionNames.splice(gameSessionNames.indexOf(sessionName), 1);
            localStorage.setItem(localStorage_sessionName_List, JSON.stringify(gameSessionNames));
    
            localStorage.removeItem(localStorage_players);
            localStorage.removeItem(localStorage_gameAttributes);
            localStorage.removeItem(localStorage_finalScores);
    
            loadAllSessions();

        }

    }

}});





function loadAllSessions() {

    const gameSessionNames = JSON.parse(localStorage.getItem(localStorage_sessionName_List));
    gameSessionList.length = 0;
    const list = document.getElementById("sessionList");
    list.innerHTML = "";

    for(let i = 0; gameSessionNames.length > i; i++) {

        const players = JSON.parse(localStorage.getItem(gameSessionNames[i] + "_" + substring_players));
        const gameAttributes = JSON.parse(localStorage.getItem(gameSessionNames[i] + "_" + substring_gameAttributes));
        const tmp = {Players: players, GameAttributes: gameAttributes};
        gameSessionList.push(tmp);

        let elementPlayersNames = "";
        for(let i = 0; players.length > i; i++) {elementPlayersNames = elementPlayersNames.concat(players[i].Name + ((i+1) == players.length ? "" : " vs "));}

        list.innerHTML += "<dt class='listElement' gameSessionIndex='" + i + "'>" + 
            "<label class='listElement-label'>" + elementPlayersNames + "</label>" + 
            "<div class='listElement-container'>" + 
            "<label class='listElement-label'>" + gameAttributes.CreatedDate + "</label>" + 
            "<button class='deleteGameButton' gameSessionName='" + gameAttributes.SessionName + "'>X</button>" + 
            "</div>" + 
            "</dt>";
    }

    resizeEvent();

}





function loadError() {

    const message = "Es gibt noch keine Partie!";

    const list = document.getElementById("sessionList");
    list.innerHTML = "<dt id='nothingInListMessage'>" + 
        "<label class='label'>" +
        message +
        "</label>" + 
        "</dt>"



}
