

import './scss/Table.scss'

import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { list_rows } from '../../../logic/utils'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useErrorHandling from '../../../hooks/useErrorHandling'

import LoaderBox from '../../Loader/Loader_Box'

import { patch__table_columns } from '../../../api/table_columns'





/**
 * 
 * Table component that renders a table with player data and allows input for scores or other data.
 * It handles loading states, possible entries for input, and syncs with the server.
 *
 * @component
 * @example
 * // Example usage of Table component
 * <Table 
 *   list_players={listPlayers} 
 *   disabled={false} 
 *   session={session} 
 * />
 *
 * @param {Object} props - The component props
 * @param {Array} props.setList_table_columns - Function to edit list of table_columns
 * @param {Array} props.list_table_columns - List of all columns for each player
 * @param {Array} props.list_players - List of players to display in the table
 * @param {boolean} props.disabled - Boolean to control whether the input fields are disabled
 * @param {Object} props.session - The session object containing the session settings (e.g., number of columns, input type, etc.)
 *
 * @returns {JSX.Element} The rendered Table component
 * 
 */

export default function Table({ 
	setList_table_columns, 
	list_table_columns, 
	list_players, 
	disabled, 
	session, 
}) {

	const [ list_columns, setList_columns ] = useState([])





	useEffect(() => {

		if(!session) return
		setList_columns(Array.from({ length: session.Columns }, (_, index) => index))		

		// eslint-disable-next-line
	}, [ session ])





	if(!list_table_columns) return 

	return <>
		<table className='table table_game'>
			<tbody>
				{list_rows.map((row, index_row) => {
					
					if(row.Name === 'Blank') return <tr key={index_row} className='blank'/>

					return <>
						<tr 
							key={index_row} 
							className={`${row.Border_Bottom ? 'border_bottom' : ''}${row.Border_Top ? 'border_top' : ''}`}
						>
							
							{/* First two columns */}
							{row.td}



							{list_players?.map((player, index_player) => {
								return <>
									{list_columns.map(column => {

										const className = `${column === session.Columns - 1 ? 'border-right' : ''}`
										const key = `${index_player}_${column}`

										if(!row.Possible_Entries || disabled) {
											if(!list_table_columns[index_player].List_Table_Columns[column]) return <div key={key}></div>
											const value = list_table_columns[index_player].List_Table_Columns[column][row.Name]
											return <>
												<td 
													key={key}
													className={className} 
													style={{ backgroundColor: player.Color }} 
												>
													<span>{disabled ? value || 0 : value}</span>
												</td>
											</>
										}

										return <>
											<td 
												key={key}	
												className={className} 
												style={{ backgroundColor: player.Color }} 
											>
												<InputElement
													setList_table_columns={setList_table_columns}
													list_table_columns={list_table_columns}
													list_players={list_players}
													index_player={index_player}
													index_row={index_row}
													session={session}
													column={column}
												/>
											</td>
										</>
									})}
								</>
							})}

						</tr>
					</>
				})}
			</tbody>
		</table>
	</>
}





const InputElement = ({
	setList_table_columns, 
	list_table_columns, 
	list_players, 
	index_player, 
	index_row, 
	session, 
	column, 
}) => {

	const ref = useRef()
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ id, setId ] = useState('')
	const [ input_value, setInput_value ] = useState('')

	const mutate__table_columns = useMutation({
		mutationFn: json => patch__table_columns(axiosPrivate, json), 
		onSuccess: data => {
			setList_table_columns(prev => {
				const tmp = [ ...prev ]
				tmp[index_player].List_Table_Columns[column] = data
				query_client.setQueryData([ 'session', session.id, 'table_columns' ], tmp)
				return tmp 
			})
		}, 
		onError: ( err, json ) => {
			const value = json.Value
			handle_error({
				err, 
				handle_no_server_response: () => {
					if(window.confirm(`Der Server antwortet nicht.\nDer Eintrag '${value}' in der ${column + 1}. Spalte für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) {
						mutate__table_columns.mutate(json)
					} else {
						init_value()
					}
				}, 
				handle_404: () => {
					alert('Eine Ressource wurde nicht gefunden!')
					navigate(`/`)
				}, 
				handle_409: () => {
					alert(`Der Eintrag '${value}' ist nicht zulässig!`)
				}, 
				handle_500: () => {
					if(window.confirm(`Beim Server ist ein Fehler aufgetreten.\nDer Eintrag '${value}' in der ${column + 1}. Spalte für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) {
						mutate__table_columns.mutate(json)
					} else {
						init_value()
					}
				}
			})
		}
	})





	const onBlur = async ( e ) => {

		const value = e.target.value

		mutate__table_columns.mutate({
			SessionID: session.id, 
			PlayerID: list_players[index_player].id, 
			Column: column, 
			Name: list_rows[index_row].Name, 
			Value: value === '' ? null : +value, 
		})

	}

	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true
		return false
	
	}

	useEffect(() => setId(index_player + '.' + index_row + '.' + column), [ index_player, index_row, column ])

	useEffect(() => {
		
		if(!session || !list_table_columns || !list_table_columns[index_player].List_Table_Columns[column]) return
		init_value()
		// eslint-disable-next-line
	}, [])

	const init_value = () => {

		const tmp = list_table_columns[index_player].List_Table_Columns[column][list_rows[index_row].Name]
		const value = typeof tmp === 'number' ? tmp : ''
		setInput_value(value)

	}





	return <>

		{mutate__table_columns.isPending && <>
			<div className='table_loader-container'>
				<LoaderBox className='table_loader' dark={true}/>
			</div>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'type' && <>
			<input 
				ref={ref}
				tabIndex={0}
				value={input_value}
				onChange={({ target }) => setInput_value(target.value)}
				onBlur={onBlur}
			/>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'select' && <>
			<select 
				ref={ref}
				tabIndex={0}
				value={input_value}
				className={`${isIOS() ? 'isios' : ''}`}
				onChange={e => { onBlur(e); setInput_value(e.target.value) }}
			>
				<option></option>
				{list_rows[index_row].Possible_Entries.map((v) => (
					<option key={v} value={v}>{v}</option>
				))}
			</select>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'select_and_type' && <>
			<input 
				list={id} 
				ref={ref}
				tabIndex={0}
				onBlur={onBlur}
				value={input_value}
				className={`${isIOS() ? 'isios' : ''}`}
				onChange={({ target }) => setInput_value(target.value)}
			/>
			<datalist id={id}>
				{list_rows[index_row].Possible_Entries.map((v) => {
					return <option key={v} value={v}/>
				})}
			</datalist>
		</>}
	</>
}
