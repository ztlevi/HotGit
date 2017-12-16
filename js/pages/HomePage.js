/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Image,
  Text,
  View,
  DeviceEventEmitter,
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './PopularPage'
import AsyncStorageTest from '../../AsyncStorageTest'
import MyPage from './my/MyPage'
import Toast, { DURATION } from 'react-native-easy-toast'
import WebViewTest from '../../WebViewTest'
import TrendingPage from './TrendingPage'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FavoritePage from './FavoritePage'

export default class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 'tb_popular'
    }
  }

  componentDidMount () {
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.toast.show(text, DURATION.LENGTH_LONG)
    })
  }

  componentWillUnmount () {
    this.listener && this.listener.remove()
  }

  static navigationOptions = {
    title: 'Home Page'
  }

  _renderTab (Component, selectTab, title, renderIcon) {
    return <TabNavigator.Item
      selected={this.state.selectedTab === selectTab}
      selectedTitleStyle={{color: '#2196F3'}}
      title={title}
      renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
      renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196F3'}]}
                                       source={renderIcon}/>}
      onPress={() => this.setState({selectedTab: selectTab})}>
      {/*pass the props to the next Component*/}
      <Component {...this.props}/>
    </TabNavigator.Item>
  }

  render () {
    return (
      <View style={styles.container}>
        <TabNavigator>
          {this._renderTab(PopularPage, 'tb_popular', 'Popular', require('../../res/images/ic_whatshot_36pt.png'))}
          {this._renderTab(TrendingPage, 'tb_trending', 'Trending', require('../../res/images/ic_all_inclusive_36pt.png'))}
          {this._renderTab(FavoritePage, 'tb_favorite', 'Favorite', require('../../res/images/ic_favorite_36pt.png'))}
          {this._renderTab(MyPage, '', 'Account', require('../../res/images/ic_account_circle_36pt.png'))}
        </TabNavigator>
        <Toast ref={toast => this.toast = toast}/>
      </View>

    )
  }
}

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
  }
})
