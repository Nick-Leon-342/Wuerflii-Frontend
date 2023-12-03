

//____________________IDs____________________

export const id_upperTable							= 'upperTable'
export const id_bottomTable							= 'bottomTable'
export const id_playerTable							= 'playerTable'





//____________________CreateObjects____________________

export const createPlayer = (name, color) => {

    return {
        Name: name,
        Color: color,
    }

}

export const createSession = (sessionName, columns, list_players) => {

    return {
		SessionName: sessionName,
        Columns: columns,
		List_Players: list_players,
    }

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

export const getPlayer = (alias, session) => {

	if(session)
	for(const p of session.List_Players) {
		if(p.Alias === alias) {
			return p
		}
	}

}

export const updateURL = (urlParams) => {

	const updatedURL = window.location.href.split('?')[0] + '?' + urlParams.toString()
	window.history.pushState({ path: updatedURL }, '', updatedURL)

}

export const handleInputTypeChange = (v, urlParams) => {

	urlParams.set('inputtype', v)
	updateURL(urlParams)
	return window.location.reload()

}

export const handleShowScoresChange = (v, urlParams) => {
	
	urlParams.set('showscores', v)
	updateURL(urlParams)

}

export const successfullyConnected = (data, columnsSum, urlParams, setSession, setInputType, setShowScores, setTableColumns, setGnadenwurf) => {

	const tmp_session = data.Session
	const tmp_listPlayers = []
	columnsSum.length = 0
	for(const Alias of tmp_session?.List_PlayerOrder) {

		tmp_listPlayers.push(getPlayer(Alias, tmp_session))
		for(let c = 0; tmp_session?.Columns > c; c++) {
			columnsSum.push({Alias, Column: c, Upper: 0, Bottom: 0, All: 0})
		}

	}
	tmp_session.List_Players = tmp_listPlayers
	
	setSession(tmp_session)
	setInputType(urlParams.get('inputtype') || tmp_session.InputType)
	setShowScores(urlParams.get('showscores') ? urlParams.get('showscores') === 'true' : tmp_session.ShowScores)
	setTableColumns(data.TableColumns)
	setGnadenwurf(data.Gnadenwürfe)

}





export const thickBorder = '2px solid var(--text-color)'

export const upperTable_rows = [
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderTop: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td style={{ borderTop: thickBorder }}><label>Nur Einser<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Zweier<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Dreier<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Vierer<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Fünfer<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td style={{ borderBottom: thickBorder }}><label>Nur Sechser<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>gesamt</td>
			<td>
				<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
			</td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>Bonus bei 63<br/>oder mehr</td>
			<td>plus 35</td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>gesamt<br/>oberer Teil</td>
			<td style={{ borderBottom: thickBorder }}>
				<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
			</td>
		</>
	}
]

export const bottomTable_rows = [
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderTop: thickBorder }}><label>Dreiferpasch</label></td>
			<td style={{ borderTop: thickBorder }}><label>alle Augen<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}><label>Viererpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}><label>Full-House</label></td>
			<td><label>25<br/>Punkte</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}><label>Kleine Straße</label></td>
			<td><label>30<br/>Punkte</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}><label>Große Straße</label></td>
			<td><label>40<br/>Punkte</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}><label>Kniffel</label></td>
			<td><label>50<br/>Punkte</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}><label>Chance</label></td>
			<td style={{ borderBottom: thickBorder }}><label>alle Augen<br/>zählen</label></td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>gesamt<br/>unterer Teil</td>
			<td>
				<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
			</td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder }}>gesamt<br/>oberer Teil</td>
			<td>
				<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
			</td>
		</>
	},
	{ td:
		<>
			<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>Endsumme</td>
			<td style={{ borderBottom: thickBorder }}>
				<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
			</td>
		</>
	}
]