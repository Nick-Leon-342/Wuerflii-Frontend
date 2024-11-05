

//____________________IDs____________________

export const id_upperTable							= 'upperTable'
export const id_bottomTable							= 'bottomTable'
export const id_playerTable							= 'playerTable'





export const formatDate = (date) => {

	const d = new Date(date)
	const day = d.getDate()
	const month = d.getMonth() + 1
	const year = d.getFullYear()

	const formattedDay = day < 10 ? `0${day}` : `${day}`
	const formattedMonth = month < 10 ? `0${month}` : `${month}`

	return `${formattedDay}.${formattedMonth}.${year}`

}

export const getPlayer = (alias, list_players) => {

	if(list_players)
	for(const p of list_players) {
		if(p.Alias === alias) {
			return p
		}
	}

}

export const updateURL = (urlParams) => {

	const updatedURL = window.location.href.split('?')[0] + '?' + urlParams.toString()
	window.history.pushState({ path: updatedURL }, '', updatedURL)

}

export const handleShowScoresChange = (v, urlParams) => {
	
	urlParams.set('showscores', v)
	updateURL(urlParams)

}





export const list_rows = [

	{
		Name: 'Upper_Table_1', 
		Possible_Entries: [ 0, 1, 2, 3, 4, 50 ],
		td:
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Einser<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_2', 
		Possible_Entries: [ 0, 2, 4, 6, 8, 50 ],
		td: 
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Zweier<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_3', 
		Possible_Entries: [ 0, 3, 6, 9, 12, 50 ],
		td: 
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Dreier<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_4', 
		Possible_Entries: [ 0, 4, 8, 12, 16, 50 ],
		td: 
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Vierer<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_5', 
		Possible_Entries: [ 0, 5, 10, 15, 20, 50 ],
		td: 
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Fünfer<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_6', 
		Possible_Entries: [ 0, 6, 12, 18, 24, 50 ],
		td: 
		<>
			<td>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				<svg viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
			</td>
			<td><label>Nur Sechser<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_Score', 
		td: 
		<>
			<td>gesamt</td>
			<td><svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg></td>
		</>, 
	}, {
		Name: 'Upper_Table_Add35', 
		td: 
		<>
			<td>Bonus bei 63<br/>oder mehr</td>
			<td>plus 35</td>
		</>, 
	}, {
		Name: 'Upper_Table_TotalScore', 
		td: 
		<>
			<td>gesamt<br/>oberer Teil</td>
			<td><svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg></td>
		</>, 
	},





	{
		Name: 'Bottom_Table_1', 
		Possible_Entries: [ 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ],
		td: 
		<>
			<td><label>Dreiferpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>,
	}, {
		Name: 'Bottom_Table_2', 
		Possible_Entries: [ 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ], 
		td:
		<>
			<td><label>Viererpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_3', 
		Possible_Entries: [ 0, 25, 50 ], 
		td: 
		<>
			<td><label>Full-House</label></td>
			<td><label>25<br/>Punkte</label></td>
		</>,
	}, {
		Name: 'Bottom_Table_4', 
		Possible_Entries: [ 0, 30, 40, 50 ], 
		td:
		<>
			<td><label>Kleine Straße</label></td>
			<td><label>30<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_5', 
		Possible_Entries: [ 0, 40, 50 ], 
		td: 
		<>
			<td><label>Große Straße</label></td>
			<td><label>40<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_6', 
		Possible_Entries: [ 0, 50 ], 
		td:
		<>
			<td><label>Kniffel</label></td>
			<td><label>50<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_7', 
		Possible_Entries: [ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ], 
		td: 
		<>
			<td><label>Chance</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_Score', 
		td:
		<>
			<td>gesamt<br/>unterer Teil</td>
			<td><svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg></td>
		</>, 
	}, {
		Name: 'Bottom_Table_UpperTableScore', 
		td:
		<>
			<td>gesamt<br/>oberer Teil</td>
			<td><svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg></td>
		</>, 
	}, {
		Name: 'Bottom_Table_TotalScore', 
		td:
		<>
			<td>Endsumme</td>
			<td><svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg></td>
		</>
	}

]
