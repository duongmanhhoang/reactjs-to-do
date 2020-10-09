import { all, spawn, call } from 'redux-saga/effects';
import {authenticateSagas} from './modules/authenticate';
import {tasksSagas} from './modules/tasks';
import {categoriesSagas} from './modules/categories';

export default function* rootSaga() {
    const sagas = [
        authenticateSagas,
        tasksSagas,
        categoriesSagas
    ];

    yield all(sagas.map(saga => spawn(function* () {
        while (true) {
            try {
                yield call(saga);
                break;
            } catch (e) {
                console.log('saga error:', e);
            }
        }
    }))
    );
}
