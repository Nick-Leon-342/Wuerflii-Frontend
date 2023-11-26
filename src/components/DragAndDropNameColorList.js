

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { isMobile } from 'react-device-detect'

export default function DragAndDropNameColorList({ List_Players, setList_Players }) {

	const handleOnDragEnd = (result) => {

		if(!result.destination) return
		const tmp = [...List_Players]
		const [item] = tmp.splice(result.source.index, 1)
		tmp.splice(result.destination.index, 0, item)

		setList_Players(tmp)

	}




	
	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='editplayers'>
				{(provided) => (
					<ul {...provided.droppableProps} ref={provided.innerRef} style={{ padding: '0' }}>
						{List_Players.map((p, index) => (
							<Draggable key={p.Alias} draggableId={p.Alias} index={index}>
								{(provided) => (
									<li
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										className='enterNamesElement'
										style={{ width: '530px' }}
									>
										<svg style={{ marginLeft: '20px', marginRight: '15px' }} height="10px" viewBox="-0.5 -0.5 741 450"><g><rect x="0" y="0" width="740" height="150" rx="16.5" ry="16.5" pointerEvents="all"/><rect x="0" y="260" width="740" height="150" rx="16.5" ry="16.5" pointerEvents="all"/></g></svg>
										<input
											defaultValue={p.Name}
											onChange={(e) => p.Name = e.target.value}
											style={{
												height: '30px', 
												margin: '5px 0', 
												width: '400px',
												fontSize: '18px', 
												color: 'var(--text-color)', 
												border: '1px solid var(--text-color-light)', 
												borderRadius: '5px', 
												padding: '2px 10px', 
												outline: 'none', 
											}}
										/>
										<input
											className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
											type='color'
											defaultValue={p.Color}
											onChange={(e) => p.Color = e.target.value}
										/>
									</li>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	)

}
