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
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>📋 Lesson Planner</h2>
      <div className="card">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="plan">
            {(provided)=> (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((it, idx)=> (
                  <Draggable key={it.id} draggableId={it.id} index={idx}>
                    {(p)=> (
                      <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', cursor: 'grab' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontWeight: 600 }}>⏱️ {it.title}</div><div className="muted small">{it.duration}min</div></div>
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
