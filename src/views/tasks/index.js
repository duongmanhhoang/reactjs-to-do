import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import propsToJS from '../../shared/prop-to-js';
import { getCategoriesState, fetchCategories } from '../../redux/modules/categories';
import Column from './column';
import './tasks.scss';

const Tasks = (props) => {
    const { handleFetchCategories, categories } = props;

    useEffect(() => {
        handleFetchCategories();
    }, []);

    const onDragEnd = (result) => {
        console.log(result);
    }

    function sortTasks(a, b) {
        if ( a.order < b.order ){
          return -1;
        }

        if ( a.order > b.order ){
          return 1;
        }

        return 0;
      }

    return (
        <>
            <div className='tasks'>
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    {categories.map((category) => {
                        const tasks = category.tasks.sort(sortTasks);

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

    return {
        tasks,
        categories
    }
};

const mapDispatchToProps = {
    handleFetchCategories: fetchCategories
};

export default connect(mapStateToProps, mapDispatchToProps)(propsToJS(Tasks));