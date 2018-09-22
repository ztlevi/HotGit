/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Toast, { DURATION } from 'react-native-easy-toast';

import BaseComponent from './BaseComponent';
import FavoritePage from './FavoritePage';
import MyPage from './my/MyPage';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';

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

export const ACTION_HOME = {
  A_SHOW_TOAST: 'showToast',
  A_RESTART: 'restart',
  A_THEME: 'theme',
};
export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my',
};

class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    let selectedTab = 'tb_trending';
    try {
      if (this.props.selectedTab) selectedTab = this.props.selectedTab;
    } catch (e) {}

    this.state = {
      selectedTab: selectedTab,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.listener = DeviceEventEmitter.addListener(
      'ACTION_HOME',
      (action, params) => this.onAction(action, params)
    );
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.listener && this.listener.remove();
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
          params: { selectedTab: jumpToTab, ...this.props },
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  _renderTab(Component, selectTab, title, renderIcon) {
    const { theme } = this.props;
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectTab}
        selectedTitleStyle={theme.styles.selectedTitleStyle}
        title={title}
        renderIcon={() => <Icon name={renderIcon} color="black" />}
        renderSelectedIcon={() => (
          <Icon name={renderIcon} color={theme.themeColor} />
        )}
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

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(HomePage);
