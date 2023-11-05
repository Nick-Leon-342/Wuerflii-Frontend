

export const NAME_REGEX = /^[A-z][A-z0-9-_]{3,49}$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,128}$/

//____________________IDs____________________

export const id_upperTable							= 'upperTable'
export const id_bottomTable							= 'bottomTable'
export const id_playerTable							= 'playerTable'


//____________________Substrings____________________

const substring_session								= 'session'
const substring_players								= 'players'
const substring_columns								= 'columns'
const substring_finalscores							= 'finalscores'

const substring_lastPlayer							= 'lastPlayer'
const substring_inputType							= 'inputType'

const substring_gnadenwurf							= 'gnadenwurf'
const substring_winner								= 'winner'
const substring_start								= 'start'


//____________________SessionStorage____________________

export const substring_sessionStorage				= 'kniffel_sessionStorage_'
export const sessionStorage_session					= substring_sessionStorage + substring_session
export const sessionStorage_players					= substring_sessionStorage + substring_players
export const sessionStorage_columns					= substring_sessionStorage + substring_columns
export const sessionStorage_finalscores				= substring_sessionStorage + substring_finalscores

export const sessionStorage_lastPlayer				= substring_sessionStorage + substring_lastPlayer
export const sessionStorage_inputType				= substring_sessionStorage + substring_inputType

export const sessionStorage_gnadenwurf				= substring_sessionStorage + substring_gnadenwurf
export const sessionStorage_winner					= substring_sessionStorage + substring_winner
export const sessionStorage_start					= substring_sessionStorage + substring_start





//____________________ClearStorage____________________

export function clearSessionStorage() {

    cSS(substring_sessionStorage)

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

export const createSession = (sessionName, columns, list_playerOrder, list_players) => {

    return {
		SessionName: sessionName,
        Columns: columns,
		InputType: 3,
        LastPlayed: new Date(),
        CreatedDate: new Date(),
		List_PlayerOrder: list_playerOrder,
		List_Players: list_players,
    }

}

export const createFinalScoreElement = (start, columns, surrender, list_winner) => {

    const finalScore = {
		Start: start,
        End: new Date(),
		Columns: columns,
		Surrender: surrender, 
		List_Winner: list_winner,
		PlayerScores: playerScores,

    }

    return finalScore

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
