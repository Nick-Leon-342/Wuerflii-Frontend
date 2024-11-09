

import './scss/Table.scss'

import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'

import { useNavigate } from 'react-router-dom'

import { list_rows } from '../../logic/utils'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'





export default function Table({ 
	setList_players, 
	list_players, 
	disabled, 
	session, 
}) {

	const [ list_columns, setList_columns ] = useState([])





	useEffect(() => {

		if(!session) return
		setList_columns(Array.from({ length: session.Columns }, (_, index) => index))		

		// eslint-disable-next-line
	}, [])




	return (
		<table className='table table_game'>
			<tbody>
				{list_rows.map((row, index_row) => {
					
					if(row.Name === 'Blank') {
						return <tr key={index_row} className='blank'/>
					}

					return (
						<tr key={index_row} className={`${row.Border_Bottom ? 'border_bottom' : ''}${row.Border_Top ? 'border_top' : ''}`}>
							
							{/* First two columns */}
							{row.td}



							{list_players?.map((player, index_player) => {
								return <>
									{list_columns.map((column, index_column) => {

										const className = `${index_column === session.Columns - 1 ? 'border-right' : ''}`

										if(!row.Possible_Entries || disabled) {
											return (
												<td style={{ backgroundColor: list_players[index_player].Color }} className={className} key={`${index_player}_${column}`}>
													<span>{player.List_Table_Columns[column][row.Name]}</span>
												</td>
											)
										}

										return (
											<td style={{ backgroundColor: list_players[index_player].Color }} className={className} key={`${index_player}_${column}`}>
												<InputElement
													setList_players={setList_players}
													list_players={list_players}
													index_player={index_player}
													index_row={index_row}
													session={session}
													column={column}
												/>
											</td>
										)
									})}
								</>
							})}

						</tr>
					)
				})}
			</tbody>
		</table>
	)
}





const InputElement = ({
	setList_players, 
	list_players, 
	index_player, 
	index_row, 
	session, 
	column, 
}) => {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ id, setId ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const [ input_value, setInput_value ] = useState('')





	const onBlur = async ( e ) => {

		const value = e.target.value
		
		
		for(let i = 0; 100 > i; i++) {
			
			let try_again = false
			setLoading(true)

			await axiosPrivate.post('/player/input', {
				SessionID: session.id, 
				PlayerID: list_players[index_player].id, 
				Column: column, 
				Name: list_rows[index_row].Name, 
				Value: value === '' ? null : +value, 
			}).then(({ data }) => {

	
				setList_players(prev => {
					const tmp = [ ...prev ]
					tmp[index_player].List_Table_Columns[column] = data.Column
					return tmp
				})

	
			}).catch(err => {
	
				handle_error({
					err, 
					handle_no_server_response: () => {
						if(window.confirm(`Der Server antwortet nicht.\nDer Eintrag '${value}' in der ${column + 1}. Spalte für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) try_again = true
					}, 
					handle_404: () => {
						alert('Benutzer, Session oder Spieler wurde nicht gefunden!')
						navigate(`/game/create`)
					}, 
					handle_409: () => {
						alert(`Der Eintrag '${value}' ist nicht zulässig!`)
						e.target.value = ''
						setInput_value('')
					}, 
					handle_500: () => {
						if(window.confirm(`Beim Server ist ein Fehler aufgetreten.\nDer Eintrag '${value}' in der ${column + 1}. Spalte für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) try_again = true
					}
				})
	
			}).finally(() => setLoading(false))


			if(!try_again) return

		}

	}

	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true
		return false
	
	}

	useEffect(() => setId(index_player + '.' + index_row + '.' + column), [ index_player, index_row, column ])

	useEffect(() => {

		if(!session) return

		const tmp = list_players[index_player].List_Table_Columns[column][list_rows[index_row].Name]
		const value = typeof tmp === 'number' ? tmp : ''
		setInput_value(value)

		// eslint-disable-next-line
	}, [])

	



	return (<>

		{loading && <>
			<div className='table_loader-container'>
				<LoaderBox className='table_loader' dark={true}/>
			</div>
		</>}

		{!loading && session?.InputType === 'type' && <>
			<input 
				value={input_value}
				onChange={({ target }) => setInput_value(target.value)}
				onBlur={onBlur}
			/>
		</>}

		{!loading && session?.InputType === 'select' && <>
			<select 
				value={input_value}
				onChange={e => { onBlur(e); setInput_value(e.target.value) }}
			>
				<option></option>
				{list_rows[index_row].Possible_Entries.map((v) => (
					<option key={v} value={v}>{v}</option>
				))}
			</select>
		</>}

		{!loading && session?.InputType === 'select_and_type' && <>
			<input 
				list={id} 
				value={input_value}
				onChange={({ target }) => setInput_value(target.value)}
				onBlur={onBlur}
			/>
			<datalist id={id}>
				{list_rows[index_row].Possible_Entries.map((v) => {
					return <option key={v} value={v}/>
				})}
			</datalist>
		</>}
	</>)
}
