export const onChangeTheme = themeFlag => ({
  type: 'ON_CHANGE_THEME',
  themeFlag,
});

export const startLoadTheme = () => ({
  type: 'START_LOAD_THEME',
});

export const loadThemeSuccess = themeFlag => ({
  type: 'LOAD_THEME_SUCCESS',
  themeFlag,
});

export const loadThemeFailed = e => ({
  type: 'LOAD_THEME_FAILED',
  error: e,
});

export const changeThemeFlagSuccess = themeFlag => ({
  type: 'CHANGE_THEME_SUCCESS',
  themeFlag,
});

export const changeThemeFlagFailed = e => ({
  type: 'CHANGE_THEME_FAILED',
  e,
});

export default [
  onChangeTheme,
  startLoadTheme,
  loadThemeSuccess,
  loadThemeFailed,
  changeThemeFlagSuccess,
  changeThemeFlagFailed,
];
