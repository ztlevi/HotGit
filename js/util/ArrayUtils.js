export default class ArrayUtils {
  /**
   * Update array, if item exists in array, then remove it. Otherwise put it in the array.
   */
  static updateArray(array, item) {
    for (var i = 0, len=array;i<len;i++) {
      var temp = array[i];
      if (temp=== item){
        array.splice(i,1);
        return;
      }
    }
    array.push(item);
  }

  /**
   * Clone an array
   * @param from
   * @returns {Array}
   */
  static clone(from) {
    if (!from) return []
    let newArray=[]
    for (let i = 0, len=from.length;i < len; i++) {
      newArray[i] = from[i]
    }
    return newArray;
  }
}