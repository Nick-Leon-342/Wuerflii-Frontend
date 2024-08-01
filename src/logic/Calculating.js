

import { id_upperTable, id_bottomTable, id_playerTable } from "./utils"





export const calculateUpperColumn = (alias, columnIndex, columnsSum) => {

	const column = document.getElementById(id_upperTable).querySelectorAll(`[alias='${alias}'][column='${columnIndex}']`)

	let columnCompleted = true
	let sum = 0

	for(let i = 0; 6 > i; i++) {

		const n = column[i].value
		if(n === '') {
			columnCompleted = false
		} else {
			sum += +n
		}

	}

	const bottomLabels = document.getElementById(id_bottomTable).querySelectorAll(`label[alias='${alias}'][column='${columnIndex}']`)
	column[6].innerText = sum
	if(Boolean(columnCompleted)) {

		sum = sum >= 63 ? sum + 35 : sum
		column[7].textContent = sum >= 63 ? 35 : '-'
		column[8].textContent = sum
		
		bottomLabels[1].textContent = sum
		
	} else {

		column[7].textContent = ''
		column[8].textContent = ''
		bottomLabels[1].textContent = ''

	}

	calculateBottomLabels(alias, columnIndex, bottomLabels, columnsSum)

	for(const c of columnsSum) {
		if(c.Alias === alias && c.Column === columnIndex) {
			c.Upper = sum
			break
		}
	}

	calculateScore(alias, columnsSum)

}

export const calculateBottomColumn = (alias, columnIndex, columnsSum) => {

	const column = document.getElementById(id_bottomTable).querySelectorAll(`[alias='${alias}'][column='${columnIndex}']`)

	let columnCompleted = true
	let sum = 0

	for(let i = 0; 7 > i; i++) {

		const n = column[i].value
		if(n === '') {
			columnCompleted = false
		} else {
			sum += Number(n)
		}

	}

	if(Boolean(columnCompleted)) {

		column[7].textContent = sum
		
	} else {

		column[7].textContent = ''
		column[9].textContent = ''

	}

	calculateBottomLabels(alias, columnIndex, document.getElementById(id_bottomTable).querySelectorAll(`label[alias='${alias}'][column='${columnIndex}']`), columnsSum)

	for(const c of columnsSum) {
		if(c.Alias === alias && c.Column === columnIndex) {
			c.Bottom = sum
			break
		}
	}

	calculateScore(alias, columnsSum)

}

export const calculateBottomLabels = (alias, columnIndex, bottomLabels, columnsSum) => {

	const up = +bottomLabels[0].textContent
	const bottom = +bottomLabels[1].textContent
	const sum = up + bottom

	bottomLabels[2].textContent = up !== 0 && bottom !== 0 ? sum : ''

	for(const c of columnsSum) {
		if(c.Alias === alias && c.Column === columnIndex) {
			c.All = +bottomLabels[2].textContent
		}
	}

}

export const calculateScore = (alias, columnsSum) => {

	let sum = 0

	for(const c of columnsSum) {
		if(c.Alias === alias) {
			sum += c.All || (c.Upper + c.Bottom)
		}
	}

	const tmp = document.getElementById(id_playerTable).querySelector(`[alias='${alias}']`)
	if(tmp) tmp.textContent = sum

}
