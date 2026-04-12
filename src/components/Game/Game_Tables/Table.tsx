

import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '../../../hooks/useErrorHandling'
import { list_rows } from '../../../logic/utils'

import { patch__table_columns } from '../../../api/table_columns'

import type { Type__Client_To_Server__Table_Columns__PATCH } from '../../../types/Type__Client_To_Server/Type__Client_To_Server__Table_Columns__PATCH'
import type { Type__Player_With_Table_Columns } from '../../../types/Type__Player_With_Table_Columns'
import type { Type__Table_Columns } from '../../../types/Type__Table_Column'
import type { Type__Session } from '../../../types/Type__Session'
import type { Type__Player } from '../../../types/Type__Player'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Custom_Button from '@/components/misc/Custom_Button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'





interface Props__Table {
	setList__player_with_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Player_With_Table_Columns>>>
	list__player_with_table_columns:	Array<Type__Player_With_Table_Columns>
	disabled:							boolean
	session:							Type__Session | undefined
}

export default function Table({ 
	setList__player_with_table_columns, 
	list__player_with_table_columns, 
	disabled, 
	session, 
}: Props__Table) {

	const { t } = useTranslation()

	const [ show, setShow ] = useState<boolean>(false)
	const [ list_columns, setList_columns ] = useState<Array<number>>([])

	const [ clicked__player, 	setClicked__player	] = useState<Type__Player>()
	const [ clicked__row, 		setClicked__row		] = useState<number>()
	const [ clicked__column, 	setClicked__column	] = useState<number>()
	const [ clicked__value, 	setClicked__value	] = useState<number | null>(null)





	useEffect(() => {
		function init() {
			if(!session) return
			setList_columns(Array.from({ length: session.Columns }, (_, index) => index))		
		}
		init()
	}, [ session ])

	function onClick(
		player:	Type__Player, 
		value:	number, 
		column:	number, 
		row:	number, 
	) {
		
		setClicked__player(player)
		setClicked__value(value)
		setClicked__column(column)
		setClicked__row(row)
		setShow(true)

	}





	if(!session || list__player_with_table_columns.length === 0) return 

	return <>
		{clicked__player && typeof clicked__column === 'number' && typeof clicked__row === 'number' && <>
			<Dialog__Input
				setList__player_with_table_columns={setList__player_with_table_columns}
				clicked__player={clicked__player}
				clicked__column={clicked__column}
				clicked__value={clicked__value}
				clicked__row={clicked__row}
				session={session}
					
				setShow={setShow}
				show={show}
			/>
		</>}



		<table className='
				flex w-max border-2 rounded-lg overflow-hidden border-muted-foreground [&_tr]:border-muted-foreground [&_td]:border-muted-foreground
				[&_td]:flex [&_td]:flex-row [&_td]:items-center [&_td]:justify-center [&_td]:w-[60px] [&_td]:h-[60px] [&_td]:gap-1 [&_span]:text-center
				[&_td:nth-child(-n+2)]:w-[120px] [&_td:nth-child(-n+2)_path]:fill-foreground! [&_td:nth-child(-n+2)]:font-bold [&_td:nth-child(2)]:border-r-2
				[&_svg]:w-6
		'>
			<tbody className='flex flex-col divide-y'>
				{list_rows.map((row, index_row) => {
					
					if(row.Name === 'Blank') return <tr key={index_row} className='h-2 border-b-2'/>

					return (
						<tr 
							key={index_row} 
							className={`flex flex-row divide-x ${row.Border_Bottom ? ' border-b-2' : ''}`}
						>
							
							{/* First two columns */}
							{row.renderTd?.(t)}



							{list__player_with_table_columns?.map((player_with_table_columns, index__player_with_table_columns) => {
								return <React.Fragment key={`${player_with_table_columns.id}_${index_row}`}>
									{list_columns.map(column => {

										const className = `${column === session.Columns - 1 && index__player_with_table_columns + 1 !== list__player_with_table_columns.length ? ' border-r-2' : ''}`
										const value = player_with_table_columns.List__Table_Columns[column][row.Name as keyof Type__Table_Columns]
										const key = `${index__player_with_table_columns}_${column}`

										if(!row.Possible_Entries || disabled) {
											if(!player_with_table_columns.List__Table_Columns[column]) return <div key={key}></div>
											return (
												<td 
													key={key}
													className={className} 
													style={{ backgroundColor: player_with_table_columns.Color }} 
												>
													<span>{disabled ? value || 0 : value}</span>
												</td>
											)
										}

										return (
											<td 
												key={key}
												className={className}
												// className='not-last'
												style={{ backgroundColor: player_with_table_columns.Color }} 
											>
												<Button
													variant='ghost'
													onClick={() => onClick(player_with_table_columns, value, column, index_row)}
													className='w-full h-full rounded-none p-0'
												>
													{value === null ? '' : value}
												</Button>
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





interface Props___Dialog__Input {
	setList__player_with_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Player_With_Table_Columns>>>

	clicked__player:	Type__Player
	clicked__column:	number
	clicked__value:		number | null
	clicked__row:		number
	session:			Type__Session

	setShow:		React.Dispatch<React.SetStateAction<boolean>>
	show:			boolean
}

const Dialog__Input = ({
	setList__player_with_table_columns, 

	clicked__player, 
	clicked__column, 
	clicked__value, 
	clicked__row, 
	session, 

	setShow, 
	show, 
}: Props___Dialog__Input) => {

	const navigate		= useNavigate()
	const { t } 		= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error 	= useErrorHandling()

	const [ input_value,		setInput_value			] = useState<string | 'none'>('none')

	const mutate__table_columns = useMutation({
		mutationFn: (json: Type__Client_To_Server__Table_Columns__PATCH) => patch__table_columns(json), 
		onSuccess: data => {

			setList__player_with_table_columns(prev => {
				if(prev === undefined) return prev
				const tmp = [ ...prev ]

				const index__player = tmp.findIndex(player => player.id === clicked__player.id)
				tmp[index__player].List__Table_Columns[clicked__column] = data

				query_client.setQueryData([ 'session', session?.id, 'table_columns' ], tmp)
				return tmp 
			})

			toast.success(t('successfully_saved'))
			setShow(false)

		}, 
		onError: ( err, json ) => {
			const value = json.Value
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('error.resource_not_found'))
					navigate(`/`)
				}, 
				handle_409: () => { toast.error(t('error.value_invalid', { value: value })) }, 
			})
		}
	})





	function init_value() { setInput_value(clicked__value === null ? 'none' : clicked__value.toString()) }

	function save() {

		const new_value = input_value === 'none' ? null : +input_value
		if(new_value === clicked__value) return

		mutate__table_columns.mutate({
			SessionID:	session.id, 
			PlayerID:	clicked__player.id, 
			Column:		clicked__column, 
			Name: 		list_rows[clicked__row].Name, 
			Value:		new_value, 
		})

	}

	useEffect(() => { 
		function init () {init_value()}
		init()
	}, [ show ])





	return <>
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader>



				<div>

					{session?.Input_Type === 'TYPE' && <>
						<Input 
							tabIndex={0}
							className='h-12 text-lg!'
							value={input_value === 'none' ? '' : input_value}
							onKeyDown={e => { if(e.code === 'Enter') save() }}
							onChange={({ target }) => setInput_value(target.value === '' ? 'none' : target.value)}
						/>
					</>}

					{session?.Input_Type === 'SELECT' && <>
						<Select
							onValueChange={value => setInput_value(value)}
							value={input_value}
						>
							<SelectTrigger className='h-full w-full'>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel>bla</SelectLabel>
									
									<SelectItem className='h-6' value='none'> </SelectItem>
									{list_rows[clicked__row].Possible_Entries?.map(value => (
										<SelectItem
											key={value}
											value={value.toString()}
										>{value.toString()}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}

					{session?.Input_Type === 'SELECT_AND_TYPE' && <>
						<Input 
							list={'1'} 
							tabIndex={0}
							className='h-12 text-lg!'
							value={input_value === 'none' ? '' : input_value}
							onKeyDown={e => { if(e.code === 'Enter') save() }}
							onChange={({ target }) => setInput_value(target.value === '' ? 'none' : target.value)}
						/>
						<datalist id={'1'}>
							{list_rows[clicked__row].Possible_Entries?.map((v) => {
								return <option key={v} value={v}/>
							})}
						</datalist>
					</>}

				</div>



				<DialogFooter>
					<Custom_Button
						ok={(clicked__value === (input_value === 'none' ? null : input_value))}
						loading={mutate__table_columns.isPending}
						text={t('save')}
						onClick={save}
					/>
				</DialogFooter>

			</DialogContent>
		</Dialog>
	</>
}
