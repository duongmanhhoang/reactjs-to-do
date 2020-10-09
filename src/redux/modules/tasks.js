import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import axios from '../../shared/axios';
import handleResponse from '../../shared/handle-response';
import { API_URL } from '../../shared/config';

export const FETCH_TASKS = 'FETCH_TASKS';
export const FETCH_TASKS_SUCCESSFULLY = 'FETCH_TASKS_SUCCESSFULLY';

export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESSFULLY = 'CREATE_TASK_SUCCESSFULLY';

export const fetchTasks = createAction(FETCH_TASKS);
export const fetchTasksSuccessfully = createAction(FETCH_TASKS_SUCCESSFULLY);

export const createTask = createAction(CREATE_TASK);
export const createTaskSuccessfully = createAction(CREATE_TASK_SUCCESSFULLY);

const setTasks = (state, action) => state.set('tasks', fromJS(action.payload));
const addNewTask = (state, action) => state.set('tasks');

const tasksInitialState = fromJS({
    tasks: []
})

export default handleActions({
    [FETCH_TASKS_SUCCESSFULLY]: setTasks,
    [CREATE_TASK_SUCCESSFULLY]: addNewTask
}, tasksInitialState);

export const getTasksState = state => state.get('tasks');

export function* tasksSagas() {
    yield all([
        takeLatest(FETCH_TASKS, fetchTasksFromApi),
        takeLatest(CREATE_TASK, createTaskFromApi)
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

function* createTaskFromApi(action) {
    const {payload} = action;
    const response = yield call(apiCreateTask, payload);

    if (response.status === 200) {
        const {data} = response;
        yield put(createTaskSuccessfully(data));
        
        return;
    }

}

export function apiFetchTasks() {
    return axios.get(`${API_URL}/api/tasks`)
        .then(response => response)
        .catch(error => error.response);
}

export function apiCreateTask(data) {
    return axios.post(`${API_URL}/api/tasks`, data)
        .then(response => response)
        .catch(error => error.response);
}