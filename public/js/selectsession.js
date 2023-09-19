

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

const socket = io(ip);

let nothingInList = false;

let players_list;
let gameAttributes_list;





function initTestData() {

    const list = document.getElementById("sessionList");
    list.innerHTML = "";

    for(let i = 0; 3 > i; i++) {

        list.innerHTML += "<dt class='listElement'>" + 
            "<label class='listElement-label'>P_0 vs ThisIsPlayer_1 vs Player_2</label>" + 
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
        const index = clickedElement.getAttribute("gameSessionIndex");
        sessionStorage.setItem(sessionStorage_players, JSON.stringify(players_list[index]));
        sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes_list[index]));

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





//____________________Load sessions____________________

function loadAllSessions() {

    socket.emit("loadSessions", {Name: sessionStorage.getItem(sessionStorage_user), Token: sessionStorage.getItem(sessionStorage_token)});

}

socket.on("loadSessions", data => {

    if(data != null) {

        const sessionNames_list = data.SessionNames_List;
        players_list = data.Players_List;
        gameAttributes_list = data.GameAttributes_List;
    
        const list = document.getElementById("sessionList");
        list.innerHTML = "";
    
        for(let i = 0; sessionNames_list.length > i; i++) {
    
            const players = players_list[i];
            const gameAttributes = gameAttributes_list[i];
    
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

    } else {

        loadError();

    }

})





function loadError() {

    const message = "Es gibt noch keine Partie!";

    const list = document.getElementById("sessionList");
    list.innerHTML = "<dt id='nothingInListMessage'>" + 
        "<label class='label'>" +
        message +
        "</label>" + 
        "</dt>"

}
