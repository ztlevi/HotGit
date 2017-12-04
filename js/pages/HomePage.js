/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage'

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'tb_popular'
    }
  }

  static navigationOptions = {
    title: 'Home Page'
  };

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_popular'}
            selectedTitleStyle={{color: 'orange'}}
            title="Popular"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_whatshot_36pt.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'orange'}]}
                                             source={require('../../res/images/ic_whatshot_36pt.png')}/>}
            badgeText="1"
            onPress={() => this.setState({selectedTab: 'tb_popular'})}>
            <PopularPage/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_trending'}
            selectedTitleStyle={{color: 'red'}}
            title="Treading"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_all_inclusive_36pt.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                             source={require('../../res/images/ic_all_inclusive_36pt.png')}/>}
            badgeText="1"
            onPress={() => this.setState({selectedTab: 'tb_trending'})}>
            <View style={styles.page2}></View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_favorite'}
            selectedTitleStyle={{color: 'orange'}}
            title="Favorite"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_favorite_36pt.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'orange'}]}
                                             source={require('../../res/images/ic_favorite_36pt.png')}/>}
            onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
            <View style={styles.page1}></View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_my'}
            selectedTitleStyle={{color: 'red'}}
            title="My Account"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_account_circle_36pt.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                             source={require('../../res/images/ic_account_circle_36pt.png')}/>}
            badgeText="1"
            onPress={() => this.setState({selectedTab: 'tb_my'})}>
            <View style={styles.page2}></View>
          </TabNavigator.Item>
        </TabNavigator>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
