

import { id_upperTable, id_bottomTable } from "./utils"
import { possibleEntries_upperTable, possibleEntries_bottomTable } from "./PossibleEntries"
import { updateURL } from "./utils"
import { calculateUpperColumn, calculateBottomColumn } from "./Calculating"



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

export const onblurEvent = ( element, setLastPlayerAlias, urlParams, socket, columnsSum, sentDataPackages, saveSentDataPackages ) => {

	const e = element.target
	if(e) {
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
		const json = { UpperTable: tableID === id_upperTable, Alias: alias, Row: row, Column: column, Value: value }
		sentDataPackages.push(json)
		saveSentDataPackages()
		socket.emit('UpdateValue', json, (response) => {
			console.log('Response', response)
		})
		
		if(tableID === id_upperTable) {
			calculateUpperColumn(alias, column, columnsSum)
		} else {
			calculateBottomColumn(alias, column, columnsSum)
		}
		
	}

}
