

import { updateURL } from '../logic/utils'
import useErrorHandling from './useErrorHandling'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'





export default function useOnBlurEvent() {

	const handle_error = useErrorHandling()





	// const onblurEvent = async ( element, setLastPlayerAlias, urlParams, axiosPrivate, navigate, joincode, columnsSum, setShow_invalidNumber, setInvalidNumberText ) => {

	// 	const e = element.target
	// 	if(!e) return

	// 	const tableID = e.getAttribute('tableid')
	// 	const row = +e.getAttribute('row')
	// 	const column = +e.getAttribute('column')
	// 	const alias = e.getAttribute('alias')

	// 	let value = e.value
	// 	const r = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[row]

	// 	if(r.includes(+value) || value === '') {
			
	// 		if(value) {
	// 			setLastPlayerAlias(alias)
	// 			urlParams.set('lastplayer', alias)
	// 			updateURL(urlParams)
	// 		}

	// 	} else {
			
	// 		setShow_invalidNumber(true)
	// 		setInvalidNumberText(`${value} ist nicht zulässig! Zulässig sind:\n${r}`)

	// 		e.value = ''
	// 		value = ''

	// 	}

	// 	value = value ? +value : null



	// 	const json = { 
	// 		isUpperTable: tableID === id_upperTable, 
	// 		Alias: alias, 
	// 		Row: row, 
	// 		Column: column, 
	// 		Value: value, 
	// 		JoinCode: +joincode 
	// 	}

	// 	for(let i = 0; 100 > i; i++) {

	// 		let tryagain = false

	// 		await axiosPrivate.post('/game/entry', json).catch((err) => {

	// 			handle_error({
	// 				err,
	// 				handle_404: () => {
	// 					window.alert('Das Spiel wurde nicht gefunden!')
	// 					return navigate('/selectsession', { replace: true })
	// 				},
	// 				handle_409: () => {
	// 					document.getElementById('modal-invalidNumber').showModal()
	// 					document.getElementById('message-invalidNumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`
	// 				}, 
	// 				handle_default: () => {
	// 					tryagain = window.confirm(`Unbekannter Fehler!\nDer Eintrag '${value === null ? '' : value}' wurde nicht gespeichert!\nErneut versuchen?`)
	// 					console.log(err)
	// 					if(!tryagain) e.value = ''
	// 				}
	// 			})
					
	// 		})
			
	// 		if(tryagain) continue
	// 		break

	// 	}

		


	// 	if(tableID === id_upperTable) {
	// 		calculateUpperColumn(alias, column, columnsSum)
	// 	} else {
	// 		calculateBottomColumn(alias, column, columnsSum)
	// 	}

	// }

	const onblurEvent = () => {}





	return onblurEvent

}
