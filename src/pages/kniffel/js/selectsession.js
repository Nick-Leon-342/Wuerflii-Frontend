

//__________________________________________________Load all sessions when site is loaded__________________________________________________

document.addEventListener('DOMContentLoaded', function() {

    loadError()

    if(isTest()) {

        initTestData()

    }else {

        try {
            loadAllSessions()
        } catch(err) {
            nothingInList = true
        }

    }
    document.getElementById('application').style.display = 'block'

}, false)

let nothingInList = false

let players_list
let gameAttributes_list





function initTestData() {

    const list = document.getElementById('sessionList')
    list.innerHTML = ''

    for(let i = 0; 3 > i; i++) {

        list.innerHTML += '<dt class="listElement">' + 
            '<label class="listElement-label">P_0 vs ThisIsPlayer_1 vs Player_2</label>' + 
            '<div class="listElement-container">' + 
            '<label class="listElement-label">02/11/2000</label>' + 
            '<button class="deleteGameButton">X</button>' + 
            '</div>' + 
            '</dt>'

    }

}





function switchToCreateGame() {

    window.location.replace('/creategame')

}




document.getElementById('sessionList').addEventListener('click', async function(event) {if(!nothingInList) {
    
    const target = event.target
    if(target.tagName !== 'BUTTON') {
        
        const clickedElement = target.closest('dt')
        const index = clickedElement.getAttribute('gameSessionIndex')
        sessionStorage.setItem(sessionStorage_players, JSON.stringify(players_list[index]))
        sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes_list[index]))

        window.location.replace('/sessionpreview')

    } else {
        
        if (window.confirm('Bist du sicher, dass du diese Session löschen möchtest?')) {
            
            const sessionName = target.getAttribute('gameSessionName')
            
            await fetch('/deletesession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ SessionName: sessionName })
            })
    
            window.location.reload()

        }

    }

}})





//____________________Load sessions____________________

async function loadAllSessions() {

    const response = await fetch('/selectsession', {
        method: 'POST',
        headers: { 'Content-Type': 'HTML/Text' },
        body: ''
    })

    try {
        const data = await response.json()
        loadAllSessionsHelp(data)
    } catch {
    }

}

function loadAllSessionsHelp(data) {

    const sessionNames_list = data.SessionNames_List
    players_list = data.Players_List
    gameAttributes_list = data.GameAttributes_List
    
    const list = document.getElementById('sessionList')
    list.innerHTML = ''
    
    for(let i = 0; sessionNames_list.length > i; i++) {
    
        const players = players_list[i]
        const gameAttributes = gameAttributes_list[i]
    
        let elementPlayersNames = ''
        for(let i = 0; players.length > i; i++) {elementPlayersNames = elementPlayersNames.concat(players[i].Name + ((i+1) == players.length ? '' : ' vs '))}
    
        list.innerHTML += '<dt class="listElement" gameSessionIndex="' + i + '">' + 
            '<label class="listElement-label">' + elementPlayersNames + '</label>' + 
            '<div class="listElement-container">' + 
            '<label class="listElement-label">' + gameAttributes.CreatedDate + '</label>' + 
            '<button class="deleteGameButton" gameSessionName="' + gameAttributes.SessionName + '">X</button>' + 
            '</div>' + 
            '</dt>'
    }
    
    resizeEvent()

}





function loadError() {

    const message = 'Es gibt noch keine Partie!'

    const list = document.getElementById('sessionList')
    list.innerHTML = '<dt id="nothingInListMessage">' + 
        '<label class="label">' +
        message +
        '</label>' + 
        '</dt>'

}
