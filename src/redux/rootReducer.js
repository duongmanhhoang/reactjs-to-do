import { combineReducers } from 'redux-immutable';
import { reducer as toastrReducer } from 'react-redux-toastr'
import authenticate from './modules/authenticate';
import tasks from './modules/tasks';
import categories from './modules/categories'

export default function rootReducer(asyncReducers) {
    return combineReducers({
        toastr: toastrReducer,
        authenticate,
        tasks,
        categories,
        ...asyncReducers
    });
};
