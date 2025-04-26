

import './scss/DragAndDropNameColorList.scss'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { ReactComponent as DragHandle } from '../../svg/Drag_Handle.svg'





/**
 * 
 * DragAndDropNameColorList component allows users to drag and drop players to reorder them,
 * and change their names and colors.
 *
 * @component
 * @example
 * // Example usage of DragAndDropNameColorList component
 * <DragAndDropNameColorList 
 *   MAX_LENGTH_PLAYER_NAME={20} 
 *   setList_edit_players={setList} 
 *   list_edit_players={players} 
 * />
 *
 * @param {Object} props - The component props
 * @param {number} props.MAX_LENGTH_PLAYER_NAME - The maximum allowed length for player names
 * @param {Function} props.setList_edit_players - Function to update the list of edited players
 * @param {Array} props.list_edit_players - List of players with names and colors that can be dragged and edited
 *
 * @returns {JSX.Element} The rendered DragAndDropNameColorList component with draggable player items
 * 
 */

export default function DragAndDropNameColorList({ 
	MAX_LENGTH_PLAYER_NAME, 
	setList_edit_players,  
	list_edit_players, 
}) {

	const handleOnDragEnd = ( result ) => {

		if(!result.destination) return

		const tmp = [ ...list_edit_players ]
		const [ item ] = tmp.splice(result.source.index, 1)
		tmp.splice(result.destination.index, 0, item)

		setList_edit_players(tmp)

	}

	const change_name = (e, index) => {

		const value = e.target.value
		const tmp = [ ...list_edit_players ]
		tmp[index].Name = value
		setList_edit_players(tmp)

	}

	const change_color = (e, index) => {

		const value = e.target.value
		const tmp = [ ...list_edit_players ]
		tmp[index].Color = value
		setList_edit_players(tmp)

	}




	
	return <>
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='editplayers'>
				{(provided) => (
					<div 
						{...provided.droppableProps} 
						ref={provided.innerRef} 
						className='dnd-list'
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
										className='element'
										style={{
											...provided.draggableProps.style,
											opacity: snapshot.isDragging ? '0.7' : '1'
										}}
									>

										<DragHandle/>

										<input
											type='text'
											className={`${p.Name.length > MAX_LENGTH_PLAYER_NAME ? 'invalid' : ''}`}
											value={p.Name}
											onChange={(e) => change_name(e, index)}
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
