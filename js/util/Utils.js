export default class Utils {
  /**
   * check if item is in items
   * @param item
   * @param items
   * @returns {boolean}
   */
  static checkFavorite(item, items) {
    for (let i = 0, len = items.length; i < len; i++) {
      let id = item.full_name ? item.full_name.toString() : item.fullName;
      id = 'id_' + id;
      if (id === items[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * check project update time
   * @param longTime project update time
   * @returns {boolean} true: don't need to update; false: need update
   */
  static checkDate(longTime) {
    let cDate = new Date();
    let tDate = new Date();
    tDate.setTime(longTime);
    if (cDate.getMonth() !== tDate.getMonth()) return false;
    if (cDate.getDay() !== tDate.getDay()) return false;
    if (cDate.getHours() - tDate.getHours() > 4) return false;
    return true;
  }
}
