import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import propsToJS from '../../shared/prop-to-js';
import { getCategoriesState, fetchCategories, dragAndDrop, getForceRenderState } from '../../redux/modules/categories';
import Column from './column';
import './tasks.scss';

const Tasks = (props) => {
    const { handleFetchCategories, categories, handleDragAndDrop, forceRender } = props;
    const [categoriesState, setCategoriesState] = useState(categories);

    useEffect(() => {
        handleFetchCategories({
            callback: setCategoriesState
        });
    }, [forceRender]);

    function sortTasks(a, b) {
        if (a.order < b.order) {
            return -1;
        }

        if (a.order > b.order) {
            return 1;
        }

        return 0;
    }

    const onDragEnd = (result) => {
        const { source, destination, reason } = result;

        if (reason === 'DROP' && destination && source) {
            const currentCategoryId = source.droppableId;
            const dropedCategoryId = destination.droppableId;
            const categoryDestination = categoriesState.find(item => item._id === dropedCategoryId);
            let tasksDestination = categoryDestination.tasks;
            const newIndex = destination.index;
            const taskId = result.draggableId;
            const newCategoriesData = sortTasksWhenDrag(tasksDestination, newIndex, result, dropedCategoryId, currentCategoryId);
            const data = {
                currentCategoryId,
                dropedCategoryId,
                taskId,
                newIndex,
                newCategoriesData
            };
            handleDragAndDrop(data);
        }
    }

    const reOrderArray = (array) => array.map((item, index) => {
        const newItem = Object.assign({}, item, { order: index });
    
        return newItem;
    })

    const sortTasksWhenDrag = (tasksDestination, newIndex, result, dropedCategoryId, currentCategoryId) => {
        let newCategoriesData = [...categoriesState];

        if (dropedCategoryId === currentCategoryId) {
            // when drag drop in same category
            let newTasks = tasksDestination.filter(item => item._id !== result.draggableId);
            const task = tasksDestination.find(item => item._id === result.draggableId);
            newTasks.splice(newIndex, 0, task)
            newTasks = reOrderArray(newTasks);
    
            newCategoriesData = categoriesState.map(item => {
                if (item._id === dropedCategoryId) {
                    const newItem = Object.assign({}, item, { tasks: newTasks.sort(sortTasks) });
    
                    return newItem
                };
    
                return item;
            });
        } else {
            // when drag drop in diff category
            const currentCategory = categoriesState.find(item => item._id === currentCategoryId);
            const task = currentCategory.tasks.find(item => item._id === result.draggableId);
            tasksDestination.splice(newIndex, 0, task);

            const newTasksDestination = reOrderArray(tasksDestination);

            newCategoriesData = categoriesState.map(item => {
                if (item._id === dropedCategoryId) {
                    const newItem = Object.assign({}, item, { tasks: newTasksDestination.sort(sortTasks) });
    
                    return newItem
                };

                if (item._id === currentCategoryId) {
                    let newTasks = item.tasks.filter(value => value._id !== result.draggableId);
                    newTasks = reOrderArray(newTasks);

                    const newItem = Object.assign({}, item, { tasks: newTasks.sort(sortTasks) });

                    return newItem;
                }
    
                return item;
            });
        }

        setCategoriesState(newCategoriesData);

        return newCategoriesData;
       
    }

    return (
        <>
            <div className='tasks'>
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    {categoriesState.map((category) => {
                        const tasks = category.tasks;

                        return <Column key={category._id} category={category} tasks={tasks} />;
                    })}
                </DragDropContext>
            </div>
        </>
    )
};

const mapStateToProps = (state) => {
    const tasks = {};
    const categories = getCategoriesState(state);
    const forceRender = getForceRenderState(state);

    return {
        tasks,
        categories,
        forceRender
    }
};

const mapDispatchToProps = {
    handleFetchCategories: fetchCategories,
    handleDragAndDrop: dragAndDrop
};

export default connect(mapStateToProps, mapDispatchToProps)(propsToJS(Tasks));