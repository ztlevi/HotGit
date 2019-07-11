import { AsyncStorage, DeviceEventEmitter } from 'react-native';

import FavoriteDAO from './FavoriteDAO';

const base64 = require('base-64');

const url_star = 'https://api.github.com/user/starred/';
const url_repo = 'https://api.github.com/repos/';
const url_page = 'https://api.github.com/user/starred?page=';
const url_user = 'https://api.github.com/user';

export default class UserDAO {
  constructor() {}

  async loadCurrentUser() {
    try {
      return await AsyncStorage.getItem('username');
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loadUserAvatar() {
    try {
      return await AsyncStorage.getItem('user_avatar');
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async fetchAuthenticationHeader() {
    try {
      return await AsyncStorage.getItem('auth_header');
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async login(username, password, callback) {
    await AsyncStorage.setItem('username', username);
    let auth_header = 'Basic ' + base64.encode(username + ':' + password);
    await AsyncStorage.setItem('auth_header', auth_header);

    this.checkAuthentication()
      .catch(error => {
        console.log(error);
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('auth_header');
      })
      .then(response => {
        if (response) {
          if (response.status === 200) {
            // fetch user's avatar
            // do the following process when fetchUserInfo finish
            this.fetchUserInfo()
              .then(() => {
                // reload starred repos when logged in
                let favoriteDAO = new FavoriteDAO();
                favoriteDAO.reloadStarredRepos();

                // go back when success
                callback();
                DeviceEventEmitter.emit('showToast', 'Logged in');
              })
              .catch(err => {
                DeviceEventEmitter.emit(
                  'showToast',
                  "Cannot fetch user's avatar"
                );
                console.log(err);
              });
          } else {
            AsyncStorage.removeItem('username');
            AsyncStorage.removeItem('auth_header');
            callback(
              'Username and password does not match. Authentication failed.'
            );
            DeviceEventEmitter.emit(
              'showLoginToast',
              'Username and password does not match. Authentication failed.'
            );
          }
        } else {
          AsyncStorage.removeItem('username');
          AsyncStorage.removeItem('auth_header');
          callback('Failed to connect server. Please check the network.');
          DeviceEventEmitter.emit(
            'showLoginToast',
            'Failed to connect server. Please check the network.'
          );
        }
      });
  }

  async logout(callback) {
    let user = await this.loadCurrentUser();
    if (user === null) {
      DeviceEventEmitter.emit('showToast', 'No user logged in');
      callback();
      return;
    }
    await AsyncStorage.clear();
    callback();
    DeviceEventEmitter.emit('showToast', 'Logged out');
  }

  /**
   * Check if authenticated
   */
  async checkAuthentication() {
    let headers = new Headers();
    let auth_header = await this.fetchAuthenticationHeader();
    headers.append('Authorization', auth_header);
    return await fetch('https://api.github.com/', { headers: headers });
  }

  /**
   * fetch starred repo
   */
  async fetchStarredRepos() {
    // if no user logged in
    let result = await this.loadCurrentUser();
    if (result === null) {
      DeviceEventEmitter.emit('showToast', 'Please Login...');
      reject(new Error('No user logged in'));
      return;
    }

    // fetch starred repos
    let auth_header = await this.fetchAuthenticationHeader();
    let headers = new Headers();
    headers.append('Authorization', auth_header);

    // fetch first page of starred repos
    let response = await fetch(url_page + '1', {
      headers: headers,
    });
    if (response.headers.map.link) {
      let links = response.headers.map.link;

      let regex = new RegExp('page\\=\\d+', 'gi'),
        result,
        indices = [];
      while ((result = regex.exec(links))) {
        indices.push(result[0].substr(5));
      }

      // get the last starred repos page number
      let lastPageNum = parseInt(indices[1]);

      let promises = [];

      let res = [];
      for (let i = 2; i <= lastPageNum; i++) {
        res.push(
          await fetch(url_page + i, {
            headers: headers,
          })
        );
      }
      return res;

      // // get rest starred repo pages
      // Promise.all(promises).then(res => {
      //   res.splice(0, 0, response);
      //   resolve(res);
      // });
    }
  }

  /**
   * check if repo starred
   */
  checkIfRepoStarred(repo) {
    let url = url_star + repo;
    return new Promise((resolve, reject) => {
      // if no user logged in
      this.loadCurrentUser().then(result => {
        if (result === null) {
          DeviceEventEmitter.emit('showToast', 'Please Login...');
          reject(new Error('No user logged in'));
          return;
        }
      });

      // check if repo starred
      let url = url_star + repo;
      this.fetchAuthenticationHeader()
        .then(auth_header => {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);

          xhr.setRequestHeader('Authorization', auth_header);
          xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );

          xhr.onreadystatechange = function() {
            //Call a function when the state changes.
            if (xhr.readyState === 4 && xhr.status === 204) {
              resolve(1);
            } else if (xhr.readyState === 4 && xhr.status === 404) {
              resolve(0);
            }
          };
          xhr.send();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * Star a repo
   */
  starRepo(repo) {
    return new Promise((resolve, reject) => {
      // if no user logged in
      this.loadCurrentUser().then(result => {
        if (result === null) {
          DeviceEventEmitter.emit('showToast', 'Please Login...');
          reject(new Error('No user logged in'));
          return;
        }
      });

      // Star a repo
      let url = url_star + repo;
      this.fetchAuthenticationHeader()
        .then(auth_header => {
          let xhr = new XMLHttpRequest();
          xhr.open('PUT', url, true);

          xhr.setRequestHeader('Content-Length', 0);
          xhr.setRequestHeader('Authorization', auth_header);
          xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );

          xhr.onreadystatechange = function() {
            //Call a function when the state changes.
            if (xhr.readyState === 4 && xhr.status === 204) {
              resolve();
            }
          };
          xhr.send();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * Unstar a repo
   */
  unstarRepo(repo) {
    let url = url_star + repo;
    return new Promise((resolve, reject) => {
      // if no user logged in
      this.loadCurrentUser().then(result => {
        if (result === null) {
          DeviceEventEmitter.emit('showToast', 'Please Login...');
          reject(new Error('No user logged in'));
          return;
        }
      });

      // unstar a repo
      this.fetchAuthenticationHeader()
        .then(auth_header => {
          let xhr = new XMLHttpRequest();
          xhr.open('DELETE', url, true);

          xhr.setRequestHeader('Content-Length', 0);
          xhr.setRequestHeader('Authorization', auth_header);
          xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );

          xhr.onreadystatechange = function() {
            //Call a function when the state changes.
            if (xhr.readyState === 4 && xhr.status === 204) {
              resolve();
            }
          };
          xhr.send();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * fetch a repo info
   */
  fetchRepoInfo(repo) {
    return new Promise((resolve, reject) => {
      // if no user logged in
      this.loadCurrentUser().then(result => {
        if (result === null) {
          DeviceEventEmitter.emit('showToast', 'Please Login...');
          reject(new Error('No user logged in'));
          return;
        }
      });

      // fetch a repo info
      let url = url_repo + repo;
      this.fetchAuthenticationHeader()
        .then(auth_header => {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);

          xhr.setRequestHeader('Authorization', auth_header);
          xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );

          xhr.onreadystatechange = function() {
            //Call a function when the state changes.
            if (xhr.readyState === 4 && xhr.status === 200) {
              resolve(xhr.responseText);
            }
          };
          xhr.send();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  /**
   * Fetch user's info
   */
  fetchUserInfo() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.loadCurrentUser(),
        this.fetchAuthenticationHeader(),
      ]).then(result => {
        let user = result[0];
        let auth_header = result[1];
        let url = url_user;

        function makeRequest(method, url, done) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.setRequestHeader('Authorization', auth_header);
          xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );
          xhr.onload = function() {
            done(null, xhr.responseText);
          };
          xhr.onerror = function() {
            done(xhr.response);
          };
          xhr.send();
        }

        makeRequest('GET', url, function(err, responseText) {
          if (err) {
            throw err;
          }
          let response = JSON.parse(responseText);
          AsyncStorage.setItem('user_avatar', response.avatar_url)
            .then(() => {
              resolve();
            })
            .catch(e => {
              reject(e);
            });
        });
      });
    });
  }
}
