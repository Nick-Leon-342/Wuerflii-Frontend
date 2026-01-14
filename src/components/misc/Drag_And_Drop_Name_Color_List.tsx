

import './scss/Drag_And_Drop_Name_Color_List.scss'

import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'

import Drag_Handle from '../../svg/Drag_Handle.svg?react'
import type { Type__Client_To_Server__Player__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Player__POST'
import type { ChangeEvent } from 'react'





interface Props__Drag_And_Drop_Name_Color_List {
	MAX_LENGTH_PLAYER_NAME:	number
	setList_edit_players:	React.Dispatch<React.SetStateAction<Array<Type__Client_To_Server__Player__POST>>>
	list_edit_players:		Array<Type__Client_To_Server__Player__POST>
}

export default function Drag_And_Drop_Name_Color_List({ 
	MAX_LENGTH_PLAYER_NAME, 
	setList_edit_players,  
	list_edit_players, 
}: Props__Drag_And_Drop_Name_Color_List) {

	function handleOnDragEnd(result: DropResult): void {

		if(!result.destination) return

		const tmp = [ ...list_edit_players ]
		const [ item ] = tmp.splice(result.source.index, 1)
		tmp.splice(result.destination.index, 0, item)

		setList_edit_players(tmp)

	}

	function change_name(
		event:	ChangeEvent<HTMLInputElement>, 
		index:	number,
	): void {

		const value = event.target.value
		const tmp = [ ...list_edit_players ]
		tmp[index].Name = value
		setList_edit_players(tmp)

	}

	function change_color(
		event:	ChangeEvent<HTMLInputElement>, 
		index:	number, 
	): void {

		const value = event.target.value
		const tmp = [ ...list_edit_players ]
		tmp[index].Color = value
		setList_edit_players(tmp)

	}




	
	return <>
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='drag_and_drop_name_color_list--droppableid'>
				{(provided) => (
					<div 
						{...provided.droppableProps} 
						ref={provided.innerRef} 
						className='drag_and_drop_name_color_list'
					>
						{list_edit_players?.map((p, index) => (
							<Draggable 
								key={p.id}
								draggableId={'Test' + p.id}
								index={index}
							>
								{(provided, snapshot) => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										className='drag_and_drop_name_color_list--element'
										style={{
											...provided.draggableProps.style,
											opacity: snapshot.isDragging ? '0.7' : '1'
										}}
									>

										<Drag_Handle/>

										<input
											type='text'
											style={{
												backgroundColor: p.Color
											}}
											value={p.Name}
											onChange={(e) => change_name(e, index)}
											className={`${p.Name.length > MAX_LENGTH_PLAYER_NAME ? 'invalid' : ''}`}
										/>

										<input
											type='color'
											value={p.Color}
											onChange={(e) => change_color(e, index)}
										/>

									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	</>
}
