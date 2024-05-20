

import { possibleEntries_bottomTable, possibleEntries_upperTable } from '../../logic/PossibleEntries'
import { bottomTable_rows, id_upperTable, upperTable_rows } from '../../logic/utils'
import { isMobile } from 'react-device-detect'





export default function Table({ tableID, list_Players, columns, tableColumns, inputType, onblurEvent, removeFocusEvent, disabled }) {

	const rows = tableID === id_upperTable ? upperTable_rows : bottomTable_rows

	const getDefaultValue = (tableID, alias, column, row) => {

		for(const c of tableColumns) {
			if(c.TableID === tableID && c.Alias === alias && c.Column === column) {
				return c[row]
			}
		}

	}

	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true
		return false
	
	}

	const inputEvent = (element) => {

		const e = element.target
		if (isNaN(parseFloat(e.value)) || !isFinite(e.value) || e.value.length > 2) {
			e.value = e.value.slice(0, -1)
		}
	
	}

	const list_columns = Array.from({ length: columns }, (_, index) => index)





	return (
		<table id={tableID} className='table table_game'>
			<tbody>
				{rows.map((r, currentRowIndex) => (
					<tr 
						key={currentRowIndex} 
						className={`row${currentRowIndex === rows.length - 3 ? ' result' : ''}`}
					>
						
						{/* First two columns */}
						{r.td}


						{list_Players?.map((p, currentPlayerIndex) => (
							list_columns.map((currentColumnIndex) => {

								const props = {
									inputMode: 'numeric',
									tableid: tableID,
									appearance: 'none',
									column: currentColumnIndex,
									row: currentRowIndex,
									playerindex: currentPlayerIndex,
									alias: p.Alias,
									onInput: inputEvent,
									defaultValue: getDefaultValue( tableID, p.Alias, currentColumnIndex, currentRowIndex ),
									style: { backgroundColor: p.Color },
								}



								const id = `${tableID}_${currentRowIndex}`
								const possibleEntries = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[currentRowIndex]

								let e
								if(currentRowIndex < rows.length - 3) {

									if(disabled) {

										e = <input { ...props } disabled/>

									} else if(inputType === 'select') {

										e = <select { ...props } style={{ backgroundColor: p.Color, paddingLeft: isMobile && isIOS() ? '20px' : '' }} onChange={(e) => {onblurEvent(e); removeFocusEvent(e)}}>
											<option></option>
											{possibleEntries.map((v) => (
												<option key={v} value={v}>{v}</option>
										))}
										</select>

									} else if(inputType === 'typeselect') {

										e = <>
											<input list={id} { ...props } onBlur={onblurEvent}/>
											<datalist id={id}>
												{possibleEntries.map((v) => {
													return <option key={v} value={v}/>
												})}
											</datalist>
										</>
									} else {
										
										e = <input { ...props } onBlur={onblurEvent}/>

									}

								} else {

									e = <label { ...props }/>

								}



								return (
									<td 
										className={currentColumnIndex === columns - 1 ? 'last': ''}
										key={`${p.Alias}.${currentRowIndex}.${currentColumnIndex}`} 
										style={{ backgroundColor: p.Color }}
									>
										{e}
									</td>
								)

							})
						))}
					</tr>
				))}
			</tbody>
		</table>
	)

}
