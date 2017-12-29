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
   * @param callBack click item's callback
   * @param icon left icon
   * @param text showing text
   * @param tintStyle icon color
   * @param expandableIcon right icon
   */
  static getSettingItem(callBack, icon, text, tintColor, expandableIcon) {
    return (
      <TouchableHighlight onPress={callBack}>
        <View style={styles.setting_item_container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={icon}
              color={tintColor}
              size={20}
              containerStyle={{ marginRight: 10 }}
            />
            <Text>{text}</Text>
          </View>
          <Icon
            name={
              expandableIcon ? 'keyboard-arrow-down' : 'keyboard-arrow-right'
            }
            color="#2196F3"
            size={20}
            containerStyle={{ marginRight: 10 }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  static getLeftButton(callBack) {
    return (
      <TouchableOpacity style={{ padding: 15 }} onPress={callBack}>
        <Icon name="keyboard-arrow-left" color="white" size={26} />
      </TouchableOpacity>
    );
  }

  static getRightButton(callBack, rightButtonTitle) {
    return (
      <TouchableOpacity style={{ padding: 12.5 }} onPress={callBack}>
        <View styl={{ flex: 1 }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '400' }}>
            {rightButtonTitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  static getRightButtonImage(callBack, rightButtonIcon) {
    return (
      <TouchableOpacity onPress={callBack} style={{ padding: 15 }}>
        {rightButtonIcon}
      </TouchableOpacity>
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
