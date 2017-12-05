import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

export default class ViewUtils {
  static getLeftButton (callBack) {
    return <TouchableOpacity
      style={{padding: 8}}
      onPress={callBack}
    >
      <Image style={{width: 26, height: 26, tintColor: 'white'}}
             source={require('../../res/images/ic_keyboard_arrow_left_36pt.png')}></Image>
    </TouchableOpacity>
  }
}