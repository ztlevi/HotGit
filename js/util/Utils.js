export default class Utils {
  /**
   * check if item is in items
   * @param item
   * @param items
   * @returns {boolean}
   */
  static checkFavorite (item, items) {
    for (let i = 0, len = items.length; i < len; i++) {
      if (item.id.toString() === items[i]) {
        return true
      }
    }
    return false
  }
}