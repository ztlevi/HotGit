import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

export default class ViewUtils {
  /**
   * Gain Setting Page Item
   * @param callback click item's callback
   * @param icon left icon
   * @param text showing text
   * @param tintStyle icon color
   * @param expandableIcon right icon
   */
  static getSettingItem(callback, icon, text, color, expandableIcon) {
    return (
      <TouchableHighlight onPress={callback}>
        <View style={styles.setting_item_container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={icon}
              color={color}
              size={20}
              containerStyle={{ marginRight: 10 }}
            />
            <Text>{text}</Text>
          </View>
          <Icon
            name={
              expandableIcon ? 'keyboard-arrow-down' : 'keyboard-arrow-right'
            }
            color={color}
            size={20}
            containerStyle={{ marginRight: 10 }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  static getLeftButton(callback) {
    return (
      <TouchableOpacity style={{ padding: 15 }} onPress={callback}>
        <Icon name="keyboard-arrow-left" color="white" size={26} />
      </TouchableOpacity>
    );
  }

  static getRightButton(callback, rightButtonTitle) {
    return (
      <TouchableOpacity style={{ padding: 12.5 }} onPress={callback}>
        <View styl={{ flex: 1 }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '400' }}>
            {rightButtonTitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  static getRightButtonImage(callback, rightButtonIcon) {
    return (
      <TouchableOpacity onPress={callback} style={{ padding: 15 }}>
        {rightButtonIcon}
      </TouchableOpacity>
    );
  }

  /**
   * Get more button
   */
  static getMoreButton(callback) {
    return (
      <TouchableHighlight
        ref="moreMenuButton"
        onPress={callback}
        underlayColor={'transparent'}
      >
        <View style={{ padding: 5, paddingRight: 8 }}>
          <Icon name="more-vert" color="white" size={24} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60,
  },
});
