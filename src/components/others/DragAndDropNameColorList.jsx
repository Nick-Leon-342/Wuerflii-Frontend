

import './scss/DragAndDropNameColorList.scss'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'





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

										<div>
											<svg viewBox='-0.5 -0.5 741 450'><g><rect x='0' y='0' width='740' height='150' rx='16.5' ry='16.5' pointerEvents='all'/><rect x='0' y='260' width='740' height='150' rx='16.5' ry='16.5' pointerEvents='all'/></g></svg>
										</div>

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
