

import { id_upperTable, id_bottomTable } from './utils'




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
