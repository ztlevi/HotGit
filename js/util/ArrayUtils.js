export default class ArrayUtils {
  /**
   * Update array, if item exists in array, then remove it. Otherwise put it in the array.
   */
  static updateArray (array, item) {
    for (var i = 0, len = array; i < len; i++) {
      var temp = array[i]
      if (temp === item) {
        array.splice(i, 1)
        return
      }
    }
    array.push(item)
  }

  /**
   * Clone an array
   * @param from
   * @returns {Array}
   */
  static clone (from) {
    if (!from) return []
    let newArray = []
    for (let i = 0, len = from.length; i < len; i++) {
      newArray[i] = from[i]
    }
    return newArray
  }

  /**
   * Identify if two arrays are equal
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  static isEqual (arr1, arr2) {
    if (!(arr1 && arr2)) return false
    if (arr1.length !== arr2.length) return false
    for (let i = 0, l = arr2.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }

  /**
   * remove the item from the array
   * @param arr
   * @param item
   * @returns None
   */
  static remove (arr, item) {
    if (!arr) return
    for (let i = 0, l = arr.length; i < l; i++) {
      if (item === arr[i])
        arr.splice(i, 1)
    }
  }

}