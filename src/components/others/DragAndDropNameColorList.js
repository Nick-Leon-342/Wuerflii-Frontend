

import './scss/DragAndDropNameColorList.scss'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'





export default function DragAndDropNameColorList({ List_Players, setList_Players }) {

	const handleOnDragEnd = ( result ) => {

		if(!result.destination) return

		const tmp = [ ...List_Players ]
		const [ item ] = tmp.splice(result.source.index, 1)
		tmp.splice(result.destination.index, 0, item)

		setList_Players(tmp)

	}




	
	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='editplayers'>
				{(provided) => (
					<div 
						{...provided.droppableProps} 
						ref={provided.innerRef} 
						className='dnd-list'
					>
						{List_Players.map((p, index) => (
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
											defaultValue={p.Name}
											onChange={(e) => p.Name = e.target.value}
										/>

										<input
											type='color'
											defaultValue={p.Color}
											onChange={(e) => p.Color = e.target.value}
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
	)

}
