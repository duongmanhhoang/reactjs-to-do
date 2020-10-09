import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import propsToJS from '../../../../shared/prop-to-js';

const Task = props => {
    const { task, index } = props;
    return (
        <>
            <Draggable
                draggableId={task._id}
                index={index}
            >
                {provided => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className='tasks__column--panel--item'
                    >
                        {task.title}
                    </div>
                )}
            </Draggable>
        </>
    )
}

export default propsToJS(Task);