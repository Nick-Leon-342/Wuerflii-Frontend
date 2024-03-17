

import { id_upperTable, id_bottomTable } from './utils'
import { possibleEntries_upperTable, possibleEntries_bottomTable } from './PossibleEntries'
import { updateURL } from './utils'
import { calculateUpperColumn, calculateBottomColumn } from './Calculating'




export const focusEvent = (element) => {

	const h = 'highlighted'

	const r = element.target.closest('tr')
	if(!r.classList.contains(h)) {
		r.classList.add(h)
	}

	removeFocusEvent(r)

}

export const removeFocusEvent = (r) => {

	const h = 'highlighted'

	const u = document.getElementById(id_upperTable).rows
	for(const e of u) {
		if(e !== r) {e.classList.remove(h)}
	}

	const b = document.getElementById(id_bottomTable).rows
	for(const e of b) {
		if(e !== r) {e.classList.remove(h)}
	}

}

export const onblurEvent = async ( element, setLastPlayerAlias, urlParams, axiosPrivate, joincode, columnsSum ) => {

	const e = element.target
	if(!e) return

	const tableID = e.getAttribute('tableid')
	const row = +e.getAttribute('row')
	const column = +e.getAttribute('column')
	const alias = e.getAttribute('alias')

	let value = e.value
	const r = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[row]

	if(r.includes(+value) || value === '') {
		
		if(value) {
			setLastPlayerAlias(alias)
			urlParams.set('lastplayer', alias)
			updateURL(urlParams)
		}

	} else {
		
		document.getElementById('modal-invalidNumber').showModal()
		document.getElementById('message-invalidNumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`

		e.value = ''
		value = ''

	}

	value = value ? +value : null



	const json = { 
		isUpperTable: tableID === id_upperTable, 
		Alias: alias, 
		Row: row, 
		Column: column, 
		Value: value, 
		JoinCode: +joincode 
	}

	for(let i = 0; 100 > i; i++) {

		let response = false

		await axiosPrivate.post('/game/entry', json).then(() => {
	
			console.log('Axios')
	
		}).catch((err) => {
	
			if(err.response.status === 400) {
				window.alert('Falsche Client-Anfrage')
			} else if(err.response.status === 409) {
				document.getElementById('modal-invalidNumber').showModal()
				document.getElementById('message-invalidNumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`
			} else {
				response = window.confirm(`Unbekannter Fehler!\nDer Eintrag '${value === null ? '' : value}' wurde nicht gespeichert!\nErneut versuchen?`)
				console.log(err)
				if(!response) e.value = ''
			}
				
		})
		
		if(response) continue
		break

	}

	


	if(tableID === id_upperTable) {
		calculateUpperColumn(alias, column, columnsSum)
	} else {
		calculateBottomColumn(alias, column, columnsSum)
	}

}
