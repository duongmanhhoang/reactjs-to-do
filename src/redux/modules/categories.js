import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import axios from '../../shared/axios';
import handleResponse from '../../shared/handle-response';
import { API_URL } from '../../shared/config';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESSFULLY = 'FETCH_CATEGORIES_SUCCESSFULLY';

export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESSFULLY = 'CREATE_TASK_SUCCESSFULLY';

export const DRAG_AND_DROP = 'DRAG_AND_DROP';
export const DRAG_AND_DROP_SUCCESSFULLY = 'DRAG_AND_DROP_SUCCESSFULLY';

export const UPDATE_FORCE_RENDER = 'UPDATE_FORCE_RENDER';

export const fetchCategories = createAction(FETCH_CATEGORIES);
export const fetchCategoriesSuccessfully = createAction(FETCH_CATEGORIES_SUCCESSFULLY);

export const createTask = createAction(CREATE_TASK);
export const createTaskSuccessfully = createAction(CREATE_TASK_SUCCESSFULLY);

export const dragAndDrop = createAction(DRAG_AND_DROP);
export const dragAndDropSuccessfully = createAction(DRAG_AND_DROP_SUCCESSFULLY);

export const updateForceRender = createAction(UPDATE_FORCE_RENDER);

const setCategories = (state, action) => state.set('data', fromJS(action.payload));
const setTasks = (state, action) => {
    let categories = state.get('data').toJS();
    categories = categories.map(item => {
        if (item._id === action.payload.category) {
            const currentTasks = [...item.tasks];
            currentTasks.push(action.payload);
            const newItem = Object.assign({}, item, { tasks: currentTasks});

            return newItem;
        }

        return item;
    });

    return state.set('data', fromJS(categories));
}

const setForceRender = state => state.set('forceRender', !state.get('forceRender'));


const categoriesInitialState = fromJS({
    data: [],
    forceRender: false
})

export default handleActions({
    [FETCH_CATEGORIES_SUCCESSFULLY]: setCategories,
    [CREATE_TASK_SUCCESSFULLY]: setTasks,
    [DRAG_AND_DROP_SUCCESSFULLY]: setCategories,
    [UPDATE_FORCE_RENDER]: setForceRender 
}, categoriesInitialState);

export const getCategoriesState = state => state.get('categories').get('data');
export const getForceRenderState = state => state.get('categories').get('forceRender');

export function* categoriesSagas() {
    yield all([
        takeLatest(FETCH_CATEGORIES, fetchCategoriesFromApi),
        takeLatest(CREATE_TASK, createTaskFromApi),
        takeLatest(DRAG_AND_DROP, dragAndDropFunc)
    ]);
}

function* fetchCategoriesFromApi(action) {
    const {payload} = action;
    const response = yield call(apiFetchCategories);

    if (response.status === 200) {
        const {data} = response;

        if (payload.callback) {
            payload.callback(data)
        }
        yield put(fetchCategoriesSuccessfully(data));
        
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

    handleResponse(response);
}

function* dragAndDropFunc(action) {
    const {payload} = action;
    const response = yield call(apiDragAndDrop, payload);

    if (response.status === 200) {
        const {data} = response;
        yield put(dragAndDropSuccessfully(data));

        return;
    }

    handleResponse(response);
}

export function apiFetchCategories() {
    return axios.get(`${API_URL}/api/categories`)
        .then(response => response)
        .catch(error => error.response);
}

export function apiCreateTask(data) {
    return axios.post(`${API_URL}/api/tasks`, data)
        .then(response => response)
        .catch(error => error.response);
}

export function apiDragAndDrop(data) {
    return axios.post(`${API_URL}/api/tasks/drag-and-drop`, data)
        .then(res => res)
        .catch(err => err.response)
}