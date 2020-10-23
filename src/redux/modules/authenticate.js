import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import history from '../../routes/history';
import axios from '../../shared/axios';
import handleResponse from '../../shared/handle-response';
import { API_URL } from '../../shared/config';
import { setCookie, getCookie } from '../../shared/cookies';

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESSFULLY = 'LOGIN_SUCCESSFULLY';

export const login = createAction(LOGIN);
export const loginSuccessfully = createAction(LOGIN_SUCCESSFULLY);

const setLoginUser = (state, action) => state.set('user', fromJS(action.payload));

const authenticateInitialState = fromJS({
    user: localStorage.getItem('user') || {}
})

export default handleActions({
    [LOGIN_SUCCESSFULLY]: setLoginUser
}, authenticateInitialState);

export const getAuthenticateState = state => state.get('authenticate');
export const getUser = state => getAuthenticateState(state).get('user');

export function* authenticateSagas() {
    yield all([
        takeLatest(LOGIN, callLogin),
    ]);
}

function* callLogin(action) {
    const { payload } = action;
    const response = yield call(loginApi, payload);

    if (response.status === 200) {
        const { data } = response;
        yield put(loginSuccessfully(data.user));
        setCookie('access_token', data.token, 60 * 60 * 24);
        setCookie('user', JSON.stringify(data.user), 60 * 60 * 24);
        toastr.success('Login Successfully');
        window.location.href = '/';

        return;
    }

    handleResponse(response);
}

export function loginApi(params) {
    return axios.post(`${API_URL}/api/auth/login`, params)
        .then(response => response)
        .catch(error => error.response);
}