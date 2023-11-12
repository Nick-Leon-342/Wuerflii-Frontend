

export const NAME_REGEX = /^[A-z][A-z0-9-_]{3,49}$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,128}$/

//____________________IDs____________________

export const id_upperTable							= 'upperTable'
export const id_bottomTable							= 'bottomTable'
export const id_playerTable							= 'playerTable'





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

export const createFinalScoreElement = (start, columns, surrender, list_winner, playerScores) => {

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
