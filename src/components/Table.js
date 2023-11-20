

import { possibleEntries_bottomTable, possibleEntries_upperTable } from '../logic/PossibleEntries'
import { bottomTable_rows, id_upperTable, upperTable_rows } from '../logic/utils'
import { isMobile } from 'react-device-detect'
import { thickBorder } from '../logic/utils'



export default function Table({ tableID, session, tableColumns, getPlayer, inputType, onblurEvent, removeFocusEvent }) {

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
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {return true}
		return false
	
	}

	const inputEvent = (element) => {

		const e = element.target
		if (isNaN(parseFloat(e.value)) || !isFinite(e.value) || e.value.length > 2) {
			e.value = e.value.slice(0, -1)
		}
	
	}

	const columns = Array.from({ length: session?.Columns }, (_, index) => index)





	return (
		<table id={tableID} className='table'>
			<tbody>
				{rows.map((r, currentRowIndex) => {
					return (
						<tr key={currentRowIndex} className='row'>
							{r.td}
							{session?.List_PlayerOrder?.map((alias, currentPlayerIndex) => {
								const player = getPlayer(alias)

								return (
									columns.map((currentColumnIndex) => {

										const css = {
											className: `kniffelInput ${inputType === 'select' ? 'select' : ''}`,
											inputMode: 'numeric',
											tableid: tableID,
											appearance: 'none',
											column: currentColumnIndex,
											row: currentRowIndex,
											playerindex: currentPlayerIndex,
											alias: player.Alias,
											onInput: inputEvent,
											defaultValue: getDefaultValue( tableID, player.Alias, currentColumnIndex, currentRowIndex ),
											style: { backgroundColor: player.Color },
										}

										const id = `${tableID}_${currentRowIndex}`
										const possibleEntries = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[currentRowIndex]

										let e
										if(currentRowIndex < rows.length - 3) {

											if(inputType === 'select') {

												e = <select {...css} style={{ backgroundColor: player.Color, paddingLeft: isMobile && isIOS() ? '20px' : '' }} onChange={(e) => {onblurEvent(e); removeFocusEvent(e)}}>
													<option></option>
													{possibleEntries.map((v) => (
														<option key={v} value={v}>{v}</option>
												))}
												</select>

											} else if(inputType === 'typeselect') {

												e = <>
													<input list={id} {...css} onBlur={onblurEvent}/>
													<datalist id={id}>
														{possibleEntries.map((v) => {
															return <option key={v} value={v}/>
														})}
													</datalist>
												</>
											} else {
												
												e = <input {...css} onBlur={onblurEvent}/>

											}

										} else {

											e = <label {...css}/>

											return (
												<td 
													key={`${currentPlayerIndex}.${currentRowIndex}.${currentColumnIndex}`} 
													style={{ 
														backgroundColor: player.Color, 
														borderLeft: currentColumnIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
														borderRight: currentColumnIndex === session?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
														borderBottom: currentRowIndex === rows.length - 1 ? thickBorder : '1px solid var(--text-color-light)',
													}}>
													{e}
												</td>
											)

										}

										return (
											<td 
												key={`${currentPlayerIndex}.${currentRowIndex}.${currentColumnIndex}`} 
												style={{ 
													backgroundColor: player.Color, 
													borderTop: currentRowIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
													borderLeft: currentColumnIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
													borderRight: currentColumnIndex === session?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
													borderBottom: currentRowIndex === rows.length - 4 ? thickBorder : '1px solid var(--text-color-light)', 
												}}>
												{e}
											</td>
										)
									})
								)
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)

}

