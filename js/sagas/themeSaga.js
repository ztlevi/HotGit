import { put, takeEvery } from 'redux-saga/effects';

import {
  changeThemeFlagFailed,
  changeThemeFlagSuccess,
  loadThemeFailed,
  loadThemeSuccess,
} from '../actions/theme';
import ThemeDAO from '../expand/dao/ThemeDAO';

function* loadTheme(action) {
  try {
    let themeDAO = new ThemeDAO();
    let themeFlag = yield themeDAO.getTheme();
    yield put(loadThemeSuccess(themeFlag));
  } catch (e) {
    yield put(loadThemeFailed(e));
  }
}

function* saveTheme(action) {
  try {
    let themeDAO = new ThemeDAO();
    yield themeDAO.save(action.themeFlag);
    yield put(changeThemeFlagSuccess(action.themeFlag));
  } catch (e) {
    yield put(changeThemeFlagFailed(e));
  }
}

function* watchLoadTheme() {
  yield takeEvery('START_LOAD_THEME', loadTheme);
}

function* watchOnSaveThemeFlag() {
  yield takeEvery('ON_CHANGE_THEME', saveTheme);
}
export default [watchLoadTheme(), watchOnSaveThemeFlag()];
