

import './scss/Table.scss'

import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, type ChangeEvent, type FocusEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { list_rows } from '../../../logic/utils'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useErrorHandling from '../../../hooks/useErrorHandling'

import LoaderBox from '../../Loader/Loader_Box'

import { patch__table_columns } from '../../../api/table_columns'

import type { Type__Session } from '../../../types/Type__Session'
import type { Type__Table_Columns } from '../../../types/Type__Table_Column'
import type { Type__Server_Reponse__Player__Get } from '../../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Server_Response__Table_Columns__Get } from '../../../types/Type__Server_Response/Type__Server_Response__Table_Columns__GET'
import type { Type__Client_To_Server__Table_Columns__PATCH } from '../../../types/Type__Client_To_Server/Type__Client_To_Server__Table_Columns__PATCH'





interface Props__Table {
	setList_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Server_Response__Table_Columns__Get>>>
	list__table_columns:		Array<Type__Server_Response__Table_Columns__Get>
	list_players:			Array<Type__Server_Reponse__Player__Get>
	disabled:				boolean
	session:				Type__Session | undefined
}

export default function Table({ 
	setList_table_columns, 
	list__table_columns, 
	list_players, 
	disabled, 
	session, 
}: Props__Table) {

	const [ list_columns, setList_columns ] = useState<Array<number>>([])





	useEffect(() => {
		function init() {
			if(!session) return
			setList_columns(Array.from({ length: session.Columns }, (_, index) => index))		
		}
		init()
	}, [ session ])





	if(!session || list__table_columns.length === 0) return 

	return <>
		<table className='table table_game'>
			<tbody>
				{list_rows.map((row, index_row) => {
					
					if(row.Name === 'Blank') return <tr key={index_row} className='blank'/>

					return (
						<tr 
							key={index_row} 
							className={`${row.Border_Bottom ? 'border_bottom' : ''}${row.Border_Top ? 'border_top' : ''}`}
						>
							
							{/* First two columns */}
							{row.td}



							{list_players?.map((player, index_player) => {
								return <React.Fragment key={`${player.id}_${index_row}`}>
									{list_columns.map(column => {

										const className = `${column === session.Columns - 1 ? 'border-right' : ''}`
										const key = `${index_player}_${column}`

										if(!row.Possible_Entries || disabled) {
											if(!list__table_columns[index_player].List__Table_Columns[column]) return <div key={key}></div>
											const value = list__table_columns[index_player].List__Table_Columns[column][row.Name as keyof Type__Table_Columns]
											return (
												<td 
													key={key}
													className={className} 
													style={{ backgroundColor: player.Color }} 
												>
													<span>{disabled ? value || 0 : value}</span>
												</td>
											)
										}

										return (
											<td 
												key={key}	
												className={className} 
												style={{ backgroundColor: player.Color }} 
											>
												<Input_Element
													setList_table_columns={setList_table_columns}
													list__table_columns={list__table_columns}
													list_players={list_players}
													index_player={index_player}
													index_row={index_row}
													session={session}
													column={column}
												/>
											</td>
										)
									})}
								</React.Fragment>
							})}

						</tr>
					)
				})}
			</tbody>
		</table>
	</>
}






interface Props__Input_Element {
	setList_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Server_Response__Table_Columns__Get>>>
	list__table_columns:		Array<Type__Server_Response__Table_Columns__Get>
	list_players:			Array<Type__Server_Reponse__Player__Get>
	index_player:			number
	index_row:				number
	session:				Type__Session
	column:					number
}

const Input_Element = ({
	setList_table_columns, 
	list__table_columns, 
	list_players, 
	index_player, 
	index_row, 
	session, 
	column, 
}: Props__Input_Element) => {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ id,				setId			] = useState<string>('')
	const [ input_value,	setInput_value	] = useState<number | null>(null)

	function init_value() {

		const tmp = list__table_columns[index_player].List__Table_Columns[column][list_rows[index_row].Name as keyof Type__Table_Columns]
		const value = tmp === null ? null : tmp
		setInput_value(value)

	}

	const mutate__table_columns = useMutation({
		mutationFn: (json: Type__Client_To_Server__Table_Columns__PATCH) => patch__table_columns(axiosPrivate, json), 
		onSuccess: data => {
			setList_table_columns(prev => {
				if(!prev) return prev
				const tmp = [ ...prev ]
				tmp[index_player].List__Table_Columns[column] = data
				query_client.setQueryData([ 'session', session?.id, 'table_columns' ], tmp)
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





	function onBlur(event: FocusEvent<HTMLInputElement | HTMLSelectElement>): void {

		const value = event.target.value

		mutate__table_columns.mutate({
			SessionID: session.id, 
			PlayerID: list_players[index_player].id, 
			Column: column, 
			Name: list_rows[index_row].Name, 
			Value: value === '' ? null : +value, 
		})

	}

	function onChange(input: string): void { 

		const input__number = parseInt(input)
		setInput_value(Number.isNaN(input__number) ? null : input__number) 
	}

	function isIOS() {

		return (
            ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        )
	
	}

	useEffect(() => { setId(index_player + '.' + index_row + '.' + column) }, [ index_player, index_row, column ])

	useEffect(() => {
		if(!session || !list__table_columns || !list__table_columns[index_player].List__Table_Columns[column]) return
		init_value()
	}, []) // eslint-disable-line





	return <>

		{mutate__table_columns.isPending && <>
			<div className='table_loader-container'>
				<LoaderBox className='table_loader' dark={true}/>
			</div>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'type' && <>
			<input 
				tabIndex={0}
				onBlur={onBlur}
				value={input_value === null ? '' : input_value}
				onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
			/>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'select' && <>
			<select 
				tabIndex={0}
				className={`${isIOS() ? 'isios' : ''}`}
				value={input_value === null ? '' : input_value}
				onChange={(event: FocusEvent<HTMLSelectElement>) => { 
					onBlur(event)
					onChange(event.target.value)
				}}
			>
				<option></option>
				{list_rows[index_row].Possible_Entries?.map((v) => (
					<option key={v} value={v}>{v}</option>
				))}
			</select>
		</>}

		{!mutate__table_columns.isPending && session?.InputType === 'select_and_type' && <>
			<input 
				list={id} 
				tabIndex={0}
				onBlur={onBlur}
				className={`${isIOS() ? 'isios' : ''}`}
				value={input_value === null ? '' : input_value}
				onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
			/>
			<datalist id={id}>
				{list_rows[index_row].Possible_Entries?.map((v) => {
					return <option key={v} value={v}/>
				})}
			</datalist>
		</>}
	</>
}
