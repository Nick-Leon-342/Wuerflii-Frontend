

import { useEffect, useState } from 'react'
import { list_rows } from '../../logic/utils'
import { isMobile } from 'react-device-detect'





export default function Table({ 
	removeFocusEvent, 
	list_players, 
	onblurEvent, 
	disabled, 
	session, 
}) {

	const [ list_columns, setList_columns ] = useState([])





	useEffect(() => {

		if(!session) return
		setList_columns(Array.from({ length: session.Columns }, (_, index) => index))		

	}, [])




	return (
		<table className='table table_game'>
			<tbody>
				{list_rows.map((row, index_row) => (
					<tr key={index_row}>
						
						{/* First two columns */}
						{row.td}



						{list_players?.map((player, index_player) => {
							return <>
								{list_columns.map(column => {

									if(!row.Possible_Entries || disabled) {
										return (
											<td>
												<span>{player.List_Table_Columns[column][row.Name]}</span>
											</td>
										)
									}

									return (
										<td>
											<InputElement
												list_players={list_players}
												index_player={index_player}
												session={session}
												column={column}
											/>
										</td>
									)


								})}
							</>
						})}

					</tr>
				))}
			</tbody>
		</table>
	)
}



const InputElement = ({
	list_players, 
	index_player, 
	index_row, 
	disabled, 
	session, 
	column, 
}) => {

	const [ input, setInput ] = useState()





	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true
		return false
	
	}

	useEffect(() => {

		if(!session) return 

		let i

		switch(session.InputType) {
			case 'type':
				i = (
					<select style={{ backgroundColor: list_players[index_player].Color, paddingLeft: isMobile && isIOS() ? '20px' : '' }} onChange={(e) => {onblurEvent(e); removeFocusEvent(e)}}>
						<option></option>
						{list_rows[index_row].Possible_Entries.map((v) => (
							<option key={v} value={v}>{v}</option>
						))}
					</select>
				)
				break

			case 'select_and_type':
				const id = index_player + '.' + index_row + '.' + column
				i = (
					<>
						<input list={id} onBlur={onblurEvent}/>
						<datalist id={id}>
							{list_rows[index_row].Possible_Entries.map((v) => {
								return <option key={v} value={v}/>
							})}
						</datalist>
					</>
				)
				break

			default: // Everything else is just 'select'
				i = <input onBlur={onblurEvent}/>
				break
		}

		setInput(i)

		// eslint-disable-next-line
	}, [ session?.InputType ])
	

	return (
		<>
			{input}
		</>
	)
}
