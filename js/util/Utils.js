export default class Utils {
  /**
   * check if item is in items
   * @param item
   * @param items
   * @returns {boolean}
   */
  static checkFavorite (item, items) {
    for (let i = 0, len = items.length; i < len; i++) {
      let id = item.full_name ? item.full_name.toString() : item.fullName
      id = 'id_' + id
      if (id === items[i]) {
        return true
      }
    }
    return false
  }
}