import React, {
  Component
} from 'react'
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

export default class ViewUtils {
  /**
   * Gain Setting Page Item
   * @param callBack click item's callback
   * @param icon left icon
   * @param text showing text
   * @param tintStyle icon color
   * @param expandableIcon right icon
   */
  static getSettingItem(callBack, icon, text, tintStyle, expandableIcon) {
    return (
      <TouchableHighlight
        onPress={callBack}
      >
        <View
          style={styles.setting_item_container}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={[{width: 16, height: 16, marginRight: 10}, tintStyle]}
              resizeMode='stretch'
              source={icon}
            />
            <Text>{text}</Text>
          </View>
          <Image source={expandableIcon ? expandableIcon : require('../../res/images/ic_keyboard_arrow_right_36pt.png')}
                 style={[{
                   marginRight: 10,
                   height: 22,
                   width: 22
                 }, {tintColor: '#2196F3'}]}
          />
        </View>
      </TouchableHighlight>

    )
  }

  static getLeftButton (callBack) {
    return <TouchableOpacity
      style={{padding: 13}}
      onPress={callBack}
    >
      <Image style={{width: 26, height: 26, tintColor: 'white'}}
             source={require('../../res/images/ic_keyboard_arrow_left_36pt.png')}></Image>
    </TouchableOpacity>
  }

  static getRightButton (callBack, rightButtonTitle) {
    return <TouchableOpacity
      style={{padding: 14.5}}
      onPress={callBack}
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

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor:'white',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    height:60
  },
})