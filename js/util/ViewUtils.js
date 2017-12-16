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
      style={{padding: 12}}
      onPress={callBack}
    >
      <Image style={{width: 26, height: 26, tintColor: 'white'}}
             source={require('../../res/images/ic_keyboard_arrow_left_36pt.png')}></Image>
    </TouchableOpacity>
  }

  static getRightButton (callBack, rightButtonTitle) {
    return <TouchableOpacity
      onPress={callBack}
      style={{padding: 15}}
    >
      <View styl={{flex: 1}}>
        <Text style={{fontSize: 18, color: 'white', fontWeight: '400'}}>{rightButtonTitle}</Text>
      </View>
    </TouchableOpacity>
  }

  static getRightButtonImage (callBack, rightButtonImage) {
    return <TouchableOpacity
      onPress={callBack}
      style={{padding: 15}}
    >
      {rightButtonImage}
    </TouchableOpacity>
  }
}