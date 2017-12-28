import { AsyncStorage } from 'react-native';
import GitHubTrending from 'GitHubTrending';

export let FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
  flag_my: 'my',
};
export default class DataRepository {
  constructor(flag) {
    this.flag = flag;
    if (flag === FLAG_STORAGE.flag_trending)
      this.trending = new GitHubTrending();
  }

  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      // retrieve local data
      this.fetchLocalRepository(url)
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            this.fetchNetRepository(url)
              .then(result => {
                resolve(result);
              })
              .catch(e => {
                reject(e);
              });
          }
        })
        .catch(e => {
          this.fetchNetRepository(url)
            .then(result => {
              resolve(result);
            })
            .catch(e => {
              reject(e);
            });
        });
    });
  }

  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      });
    });
  }

  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      if (this.flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then(response => response.json())
          .then(responseData => {
            // if (!result) {
            //   reject(new Error('responseData is null'))
            //   return
            // }
            // resolve(result.items)
            // this.saveRepository(url, result.items)
            if (this.flag === FLAG_STORAGE.flag_my && responseData) {
              this.saveRepository(url, responseData);
              resolve(responseData);
            } else if (responseData && responseData.items) {
              this.saveRepository(url, responseData.items);
              resolve(responseData.items);
            } else {
              reject(new Error('responseData is null'));
            }
          })
          .catch(error => {
            reject(error);
          });
      } else {
        this.trending.fetchTrending(url).then(result => {
          if (!result) {
            reject(new Error('responseData is null'));
            return;
          }
          this.saveRepository(url, result);
          resolve(result);
        });
      }
    });
  }

  saveRepository(url, items, callBack) {
    if (!url || !items) return;
    let wrapData;
    if (this.flag === FLAG_STORAGE.flag_my) {
      wrapData = { item: items, update_date: new Date().getTime() };
    } else {
      wrapData = { items: items, update_date: new Date().getTime() };
    }
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
  }
}
