import { all } from 'redux-saga/effects';
import themeSaga from './themeSaga';

export default function* rootSaga() {
  yield all([...themeSaga]);
}
