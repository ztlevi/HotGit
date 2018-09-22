import _cloneDeep from 'lodash/cloneDeep';

import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory';

const initialState = {
  theme: ThemeFactory.createTheme(ThemeFlags['Default']),
};
const theme = (state = initialState, action) => {
  let newState = _cloneDeep(state);

  switch (action.type) {
    case 'START_LOAD_THEME':
      break;
    case 'LOAD_THEME_SUCCESS':
      newState.theme = ThemeFactory.createTheme(action.themeFlag);
      break;
    case 'LOAD_THEME_FAILED':
      console.log(action.e);
      break;
    case 'ON_CHANGE_THEME':
      newState.theme = ThemeFactory.createTheme(action.themeFlag);
      break;
    case 'CHNAGE_THEME_FLAGE_SUCCESS':
      console.log(`Theme ${action.themeFlag} changed successfully!`);
      break;
    case 'CHANGE_THEME_FAILED':
      console.log(action.e);
      break;
    default:
      break;
  }

  return newState;
};

export default theme;
