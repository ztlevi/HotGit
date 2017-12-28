import { AsyncStorage } from 'react-native';
import DataRepository, { FLAG_STORAGE } from './DataRepository';
import Utils from '../../util/Utils';

export default class RepositoryUtils {
  constructor(aboutCommon) {
    this.aboutCommon = aboutCommon;
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
    this.itemMap = new Map();
  }

  /**
   * Update data
   * @param k
   * @param v
   */
  updateData(k, v) {
    this.itemMap.set(k, v);
    let arr = [];
    for (let value of this.itemMap.values()) {
      arr.push(value);
    }
    this.aboutCommon.onNotifyDataChanged(arr);
  }

  /**
   * Fetch data on given url
   * @param url
   */
  fetchRepository(url) {
    this.dataRepository
      .fetchRepository(url)
      .then(result => {
        if (result) {
          this.updateData(url, result);
          if (!Utils.checkDate(result.update_date)) {
            return this.dataRepository.fetchNetRepository(url);
          }
        }
      })
      .then(item => {
        if (item) {
          this.updateData(url, item);
        }
      })
      .catch(e => {});
  }

  /**
   * Batch fetching data on given urls
   * @param urls
   */
  fetchRepositories(urls) {
    for (let i = 0, l = urls.length; i < l; i++) {
      let url = urls[i];
      this.fetchRepository(url);
    }
  }
}
