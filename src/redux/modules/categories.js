import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import axios from '../../shared/axios';
import handleResponse from '../../shared/handle-response';
import { API_URL } from '../../shared/config';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESSFULLY = 'FETCH_CATEGORIES_SUCCESSFULLY';

export const fetchCategories = createAction(FETCH_CATEGORIES);
export const fetchCategoriesSuccessfully = createAction(FETCH_CATEGORIES_SUCCESSFULLY);

const setCategories = (state, action) => state.set('data', fromJS(action.payload));

const categoriesInitialState = fromJS({
    data: []
})

export default handleActions({
    [FETCH_CATEGORIES_SUCCESSFULLY]: setCategories
}, categoriesInitialState);

export const getCategoriesState = state => state.get('categories').get('data');

export function* categoriesSagas() {
    yield all([
        takeLatest(FETCH_CATEGORIES, fetchCategoriesFromApi),
    ]);
}

function* fetchCategoriesFromApi() {
    const response = yield call(apiFetchCategories);

    if (response.status === 200) {
        const {data} = response;
        yield put(fetchCategoriesSuccessfully(data));
        
        return;
    }

    handleResponse(response);
}

export function apiFetchCategories() {
    return axios.get(`${API_URL}/api/categories`)
        .then(response => response)
        .catch(error => error.response);
}