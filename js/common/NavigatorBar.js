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

module.exports = ComponentWithNavigationBar;

const defaultRB = {
  title: 'Next',
  handler: () => alert('hello!'),
};
const defaultLB = {
  title: 'Next',
  handler: () => alert('hello!'),
};
const defaultTitle = {
  title: 'Hello, world',
};

const STATUS_BAR_HEIGHT = 20;

function ComponentWithNavigationBar(
  titleConfig = defaultTitle,
  leftButtonConfig = null,
  rightButtonConfig = null
) {
  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'ios' ? 0 : STATUS_BAR_HEIGHT }} />
      <NavigationBar
        tintColor="#2196F3"
        statusBar={{
          style: 'light-content',
          tintColor: '#2196F3',
        }}
        title={titleConfig}
        leftButton={leftButtonConfig}
        rightButton={rightButtonConfig}
      />
    </View>
  );
}

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const StatusBarShape = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  hidden: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3',
  },
  navBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
  },
  titleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});
