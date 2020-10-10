import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import axios from '../../shared/axios';
import handleResponse from '../../shared/handle-response';
import { API_URL } from '../../shared/config';

export const FETCH_TASKS = 'FETCH_TASKS';
export const FETCH_TASKS_SUCCESSFULLY = 'FETCH_TASKS_SUCCESSFULLY';

export const fetchTasks = createAction(FETCH_TASKS);
export const fetchTasksSuccessfully = createAction(FETCH_TASKS_SUCCESSFULLY);

const setTasks = (state, action) => state.set('tasks', fromJS(action.payload));

const tasksInitialState = fromJS({
    tasks: []
})

export default handleActions({
    [FETCH_TASKS_SUCCESSFULLY]: setTasks
}, tasksInitialState);

export const getTasksState = state => state.get('tasks');

export function* tasksSagas() {
    yield all([
        takeLatest(FETCH_TASKS, fetchTasksFromApi)
    ]);
}

function* fetchTasksFromApi() {
    const response = yield call(apiFetchTasks);

    if (response.status === 200) {
        const {data} = response;
        yield put(fetchTasksSuccessfully(data.tasks));
        
        return;
    }

    handleResponse(response);
}

export function apiFetchTasks() {
    return axios.get(`${API_URL}/api/tasks`)
        .then(response => response)
        .catch(error => error.response);
}
