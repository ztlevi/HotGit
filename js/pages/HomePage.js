/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import MyPage from './my/MyPage';
import Toast, { DURATION } from 'react-native-easy-toast';
import TrendingPage from './TrendingPage';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import FavoritePage from './FavoritePage';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

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

export const ACTION_HOME = { A_SHOW_TOAST: 'showToast', A_RESTART: 'restart' };
export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my',
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.navigation;

    let selectedTab = 'tb_trending';
    try {
      selectedTab = state.params.selectedTab;
    } catch (e) {}

    this.state = {
      selectedTab: selectedTab,
    };
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(
      'ACTION_HOME',
      (action, params) => this.onAction(action, params)
    );
  }

  /**
   * Notify callback
   */
  onAction(action, params) {
    if (ACTION_HOME.A_RESTART === action) {
      this.onRestart(params.jumpToTab);
    } else if (ACTION_HOME.A_SHOW_TOAST === action) {
      this.toast.show(params.text, DURATION.LENGTH_LONG);
    }
  }

  /**
   * Restart homepage
   * params jumpToTab: default page
   */
  onRestart(jumpToTab) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'homePage',
          params: { selectedTab: jumpToTab },
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
  }

  _renderTab(Component, selectTab, title, renderIcon) {
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectTab}
        selectedTitleStyle={{ color: '#2196F3' }}
        title={title}
        renderIcon={() => <Icon name={renderIcon} color="black" />}
        renderSelectedIcon={() => <Icon name={renderIcon} color="#2196F3" />}
        onPress={() => this.setState({ selectedTab: selectTab })}
      >
        {/*pass the props to the next Component*/}
        <Component {...this.props} />
      </TabNavigator.Item>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          {this._renderTab(PopularPage, 'tb_popular', 'Popular', 'whatshot')}
          {this._renderTab(TrendingPage, 'tb_trending', 'Trending', 'ac-unit')}
          {this._renderTab(FavoritePage, 'tb_favorite', 'Favorite', 'favorite')}
          {this._renderTab(MyPage, '', 'Account', 'account-circle')}
        </TabNavigator>
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}
