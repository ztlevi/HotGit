import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Image, Text, View, TouchableOpacity } from 'react-native';
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
            <Icon name={icon} color={color} size={20} containerStyle={{ marginRight: 10 }} />
            <Text>{text}</Text>
          </View>
          <Icon
            name={expandableIcon ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
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
      <View style={styles.titleBarItem}>
        <TouchableOpacity onPress={callback}>
          <Icon name="keyboard-arrow-left" color="white" size={26} />
        </TouchableOpacity>
      </View>
    );
  }

  static getRightButton(callback, rightButtonTitle) {
    return (
      <View style={styles.titleBarItem}>
        <TouchableOpacity onPress={callback}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '400' }}>
            {rightButtonTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  static getRightButtonImage(callback, rightButtonIcon) {
    return (
      <View style={styles.titleBarItem}>
        <TouchableOpacity onPress={callback}>{rightButtonIcon}</TouchableOpacity>
      </View>
    );
  }

  /**
   * Get more button
   */
  static getMoreButton(callback) {
    return (
      <View style={styles.titleBarItem}>
        <TouchableHighlight ref="moreMenuButton" onPress={callback} underlayColor={'transparent'}>
          <Icon name="more-vert" color="white" size={24} />
        </TouchableHighlight>
      </View>
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
  titleBarItem: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
