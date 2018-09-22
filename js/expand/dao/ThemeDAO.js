import { AsyncStorage } from 'react-native';

import { ThemeFlags } from '../../../res/styles/ThemeFactory';

const THEME_KEY = 'theme_key';

export default class ThemeDAO {
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          this.save(ThemeFlags.Default);
          result = ThemeFlags.Default;
        }
        resolve(result);
      });
    });
  }
  /**
   * Save theme flag
   */
  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, error => {});
  }
}
