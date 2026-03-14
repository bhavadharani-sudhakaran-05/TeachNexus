import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const initial = [
  { id: 'a', title: 'Starter activity', duration: 10 },
  { id: 'b', title: 'Main activity', duration: 20 },
  { id: 'c', title: 'Assessment', duration: 10 }
]

export default function LessonPlanner(){
  const [items, setItems] = React.useState(initial)

  function onDragEnd(result){
    if (!result.destination) return
    const newItems = Array.from(items)
    const [moved] = newItems.splice(result.source.index,1)
    newItems.splice(result.destination.index,0,moved)
    setItems(newItems)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Lesson Planner</h2>
      <div className="bg-white p-4 rounded shadow">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="plan">
            {(provided)=> (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {items.map((it, idx)=> (
                  <Draggable key={it.id} draggableId={it.id} index={idx}>
                    {(p)=> (
                      <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="p-3 border rounded bg-gray-50">
                        <div className="flex justify-between"><div className="font-medium">{it.title}</div><div className="text-sm text-gray-500">{it.duration}m</div></div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
