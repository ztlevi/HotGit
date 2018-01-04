/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper';
import { ACTION_HOME } from './HomePage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...ifIphoneX({
      paddingBottom: 15,
    }),
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 22,
    width: 22,
  },
  page1: {
    flex: 1,
    backgroundColor: 'orange',
  },
  page2: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: this.props.theme };
  }

  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener(
      'ACTION_BASE',
      (action, params) => this.onBaseAction(action, params),
    );
  }

  componentWillUnmount() {
    this.baseListener && this.baseListener.remove();
  }

  /**
   * Notify callback
   */
  onBaseAction(action, params) {
    if (ACTION_HOME.A_THEME === action) {
      this.onThemeChange(params);
    }
  }

  /**
   * update when theme changes
   */
  onThemeChange(theme) {
    if (!theme) return;
    this.setState({
      theme: theme,
    });
  }
}
