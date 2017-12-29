import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import keys from '../../../res/data/keys.json';
import langs from '../../../res/data/langs.json';

export let FLAG_LANGUAGE = {
  flag_language: 'flag_language_language',
  flag_key: 'flag_language_key',
};

export default class LanguageDAO {
  constructor(flag) {
    this.flag = flag;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result) {
            try {
              resolve(JSON.parse(result));
            } catch (e) {
              reject(e);
            }
          } else {
            let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langs;
            this.save(data);
            resolve(data);
          }
        }
      });
    });
  }

  save(data) {
    AsyncStorage.setItem(
      this.flag,
      JSON.stringify(data),
      (error, result) => {}
    );
  }

  resetKeys() {
    AsyncStorage.getItem(this.flag, (error, result) => {
      if (error) {
        console.log('Cannot reset!');
      } else {
        AsyncStorage.setItem(
          FLAG_LANGUAGE.flag_key,
          JSON.stringify(keys),
          (error, result) => {}
        );
      }
    });
  }

  resetLangs() {
    AsyncStorage.getItem(this.flag, (error, result) => {
      if (error) {
        console.log('Cannot reset!');
      } else {
        AsyncStorage.setItem(
          FLAG_LANGUAGE.flag_language,
          JSON.stringify(langs),
          (error, result) => {}
        );
      }
    });
  }
}
