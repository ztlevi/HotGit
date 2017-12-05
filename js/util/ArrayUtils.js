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
}