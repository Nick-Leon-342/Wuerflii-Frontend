

//____________________IDs____________________

export const id_upperTable                         = 'upperTable'
export const id_bottomTable                        = 'bottomTable'
export const id_playerTable                        = 'playerTable'


//____________________Substrings____________________

const substring_players                     = 'players'
const substring_attributes                  = 'attributes'

const substring_gnadenwurf                  = 'gnadenwurf'
const substring_winner                      = 'winner'


//____________________SessionStorage____________________

const substring_sessionStorage                     = 'kniffel_sessionStorage_'
export const sessionStorage_players                = substring_sessionStorage + substring_players
export const sessionStorage_attributes             = substring_sessionStorage + substring_attributes

export const sessionStorage_gnadenwurf             = substring_sessionStorage + substring_gnadenwurf
export const sessionStorage_winner                 = substring_sessionStorage + substring_winner

export const sessionStorage_upperTable_substring   = substring_sessionStorage + id_upperTable + '_'
export const sessionStorage_bottomTable_substring  = substring_sessionStorage + id_bottomTable + '_'





//____________________ClearStorage____________________

export function clearSessionStorage() {

    cSS(substring_sessionStorage)

}

export function clearSessionStorageTables() {

    cSS(sessionStorage_upperTable_substring)
    cSS(sessionStorage_bottomTable_substring)

}

function cSS(substring) {

    const sessionStorage_Keys = [];

    for(let i = 0; i < sessionStorage.length; i++) {sessionStorage_Keys.push(sessionStorage.key(i))}
    
    for(const key of sessionStorage_Keys) {
        if (key.includes(substring)) {
            sessionStorage.removeItem(key)
        }
    }

}





//____________________CreateObjects____________________

export const createPlayer = (name, alias, color) => {
    return {
        Name: name,
        Alias: alias,
        Color: color,
        Wins: 0
    }
}

export const createAttributes = (columns) => {
    return {
        Columns: columns,
        LastPlayed: new Date(),
        CreatedDate: new Date(),
        SessionName: ''
    }
}

export const createFinalScoreElement = (players, scoreList) => {

    const finalScore = {
        Played: new Date()
    }

    for(let i = 0; i < players.length; i++) {
        finalScore[players[i].Alias] = scoreList[i]
    }

    return finalScore;

}

export const formatDate = (date) => {

	const d = new Date(date)
	const day = d.getDate()
	const month = d.getMonth() + 1
	const year = d.getFullYear()

	const formattedDay = day < 10 ? `0${day}` : `${day}`
	const formattedMonth = month < 10 ? `0${month}` : `${month}`

	return `${formattedDay}.${formattedMonth}.${year}`

}





//____________________ResizeEvent____________________

export const resizeEvent = () => {

    const a = document.getElementById('App')
    const body = document.body

	if(!a) return

	body.style.height = '100%'
    if(a.offsetHeight >= window.innerHeight) {
        body.style.height = '100%'
        // body.style.height = '100vh'
    } else {
        body.style.height = '100vh'
        // body.style.height = '100%'
    }

    if(a.offsetWidth >= window.innerWidth) {
        body.style.justifyContent = 'left'
        a.style.borderRadius = '0px'
        a.style.marginTop = '10px'
        a.style.marginBottom = '10px'
    } else {
        body.style.justifyContent = 'center'
        a.style.borderRadius = '20px'
        a.style.marginTop = '0px'
        a.style.marginBottom = '0px'
    }
    
}
