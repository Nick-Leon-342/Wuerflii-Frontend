

//__________________________________________________Check SessionStorage before displaying__________________________________________________

document.addEventListener('DOMContentLoaded', function() {

    const p = sessionStorage.getItem(sessionStorage_players)
    const ga = sessionStorage.getItem(sessionStorage_gameAttributes)
    const o = sessionStorage.getItem(sessionStorage_offsetWidth)
    if(p && !p.isNaN && ga && o) {
        if(window.confirm('Es wurde ein Spiel gefunden!\nSoll es geladen werden?')) {
            window.location.replace('/game')
        } else {
            ok()
        }
    } else {
        ok()
    }


}, false)

function ok() {
    clearSessionStorage()
    document.getElementById('application').style.display = 'block'
}





function next() {

    const playercount = document.getElementById('players').value
    gameAttributes = createGameAttributes(document.getElementById('columns').value)

    if(isNaN(playercount) || isNaN(gameAttributes.Columns) || playercount == 0 || gameAttributes.Columns == 0 || playercount > 16 || gameAttributes.Columns > 10) {return}

    sessionStorage.setItem(sessionStorage_players, playercount)
    sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes))

    window.location.replace('/enternames')

}

async function logout() {

    await fetch('/logout', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: ''
    })

    window.location.reload()

}

function switchToSelectSession() {

    window.location.replace('/selectsession')

}
