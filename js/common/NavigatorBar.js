import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory';
import { ifIphoneX } from 'react-native-iphone-x-helper';

module.exports = ComponentWithNavigationBar;

const defaultTitle = {
  title: 'Hello, world',
};

const STATUS_BAR_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3',
  },
});

function ComponentWithNavigationBar(
  title = defaultTitle,
  leftButton = null,
  rightButton = null,
  themeColor = '#2196F3'
) {
  return (
    <View style={{ backgroundColor: themeColor }}>
      <View
        style={{
          height: Platform.OS === 'ios' ? 0 : STATUS_BAR_HEIGHT,
          ...ifIphoneX({
            height: 10,
          }),
        }}
      />
      <NavigationBar
        tintColor={themeColor}
        statusBar={{
          style: 'light-content',
          tintColor: themeColor,
        }}
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}
      />
    </View>
  );
}
