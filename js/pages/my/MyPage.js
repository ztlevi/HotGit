import React, { Component } from 'react'
import {
  View,
  Image,
  Alert,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Text,
  DeviceEventEmitter,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import DataRepository from '../../expand/dao/DataRepository'
import FavoriteDAO from '../../expand/dao/FavoriteDAO'
import UserDao from '../../expand/dao/UserDao'
import { MORE_MENU } from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'

export default class MyPage extends Component {
  constructor (props) {
    super(props)
    this.favoriteDao = new FavoriteDAO()
    this.userDao = new UserDao()
    this.state = {
      user: ''
    }
  }

  componentDidMount() {
    this.loadUser()
  }

  loadUser() {
    this.userDao.loadCurrentUser()
      .then(result => {
        this.setState({
          user: result
        })
      })
  }
  logoutUser() {
    this.setState({
      user:null
    })
  }

  onClick (tab) {
    let TargetComponent, params = {...this.props, menuType: tab}
    switch (tab) {
      case MORE_MENU.Custom_Language:
        TargetComponent = 'customKeyPage'
        params.flag = FLAG_LANGUAGE.flag_language
        break
      case MORE_MENU.Custom_Key:
        TargetComponent = 'customKeyPage'
        params.flag = FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Remove_Key:
        TargetComponent = 'customKeyPage'
        params.flag = FLAG_LANGUAGE.flag_key
        params.isRemoveKey = true
        break
      case MORE_MENU.Sort_Key:
        TargetComponent = 'sortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Sort_Language:
        TargetComponent = 'sortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_language
        break
      case MORE_MENU.Login:
        TargetComponent = 'loginPage'
        params.user = this.state.user
        params.loadUser = ()=>this.loadUser()
        params.logoutUser = () => this.logoutUser()
        break
      case MORE_MENU.Custom_Theme:
        break
      case MORE_MENU.About_Author:
        TargetComponent = 'aboutMePage'
        break
      case MORE_MENU.About:
        TargetComponent = 'aboutPage'
        break
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, {...params})
    }
  }

  getItem (tag, icon, text) {
    return (
      ViewUtils.getSettingItem(() => this.onClick(tag), icon, text, {tintColor: '#2196F3'}, null)
    )
  }

  render () {
    let title = <Text style={styles.titleText}>My Account</Text>
    let userDao = new UserDao()

    const {navigate} = this.props.navigation
    return <View style={GlobalStyles.root_container}>
      {ComponentWithNavigationBar(title)}
      <ScrollView>
        <TouchableHighlight
          onPress={() => this.onClick(MORE_MENU.Login)}
        >
          <View
            style={[styles.row, {height: 90}]}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 40, height: 40, marginRight: 10, tintColor: '#2196F3'}}
                source={require('../../../res/images/ic_whatshot_36pt.png')}
              />
              <Text style={{fontSize:20}}>{this.state.user ? this.state.user : 'User login'}</Text>
            </View>
            <Image source={require('../../../res/images/ic_keyboard_arrow_right_36pt.png')}
                   style={[{
                     marginRight: 10,
                     height: 22,
                     width: 22
                   }, {tintColor: '#2196F3'}]}
            />
          </View>
        </TouchableHighlight>
        <View style={GlobalStyles.line}/>

        {/*Popular setting*/}
        <Text style={styles.groupTitle}>Popular language setting</Text>
        <View style={GlobalStyles.line}/>
        {this.getItem(MORE_MENU.Custom_Language, require('./images/ic_custom_language.png'), 'Custom Language')}
        <View style={GlobalStyles.line}/>
        {/*Languate Sort*/}
        {this.getItem(MORE_MENU.Sort_Language, require('./images/ic_swap_vert.png'), 'Sort Language')}
        <View style={GlobalStyles.line}/>

        {/*Trending Key setting*/}
        <Text style={styles.groupTitle}>Trending page key setting</Text>
        <View style={GlobalStyles.line}/>
        {this.getItem(MORE_MENU.Custom_Key, require('./images/ic_custom_language.png'), 'Custom Key')}
        <View style={GlobalStyles.line}/>
        {/*Key Sort*/}
        {this.getItem(MORE_MENU.Sort_Language, require('./images/ic_swap_vert.png'), 'Sort Language')}
        <View style={GlobalStyles.line}/>
        {/*Key remove*/}
        {this.getItem(MORE_MENU.Remove_Key, require('./images/ic_remove.png'), 'Remove Key')}
        <View style={GlobalStyles.line}/>

        {/*More setting*/}
        <Text style={styles.groupTitle}>More</Text>
        <View style={GlobalStyles.line}/>
        {/*custom theme*/}
        {this.getItem(MORE_MENU.Custom_Theme, require('./images/ic_custom_theme.png'), 'Custom Theme')}
        <View style={GlobalStyles.line}/>
        {/*About Author*/}
        {this.getItem(MORE_MENU.About, require('./images/ic_view_quilt.png'), 'About')}
        <View style={GlobalStyles.line}/>
        {this.getItem(MORE_MENU.About_Author, require('./images/ic_insert_emoticon.png'), 'About Author')}
        <View style={GlobalStyles.line}/>

      </ScrollView>

      {/*/!*Custom Pages*!/*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*navigate('customKeyPage', {flag: FLAG_LANGUAGE.flag_key})*/}
      {/*}}>Custom Key</Text>*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*navigate('customKeyPage', {flag: FLAG_LANGUAGE.flag_language})*/}
      {/*}}>Custom Languages</Text>*/}

      {/*/!*Sort Pages*!/*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*navigate('sortKeyPage', {flag: FLAG_LANGUAGE.flag_language})*/}
      {/*}}>Sort Key</Text>*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*navigate('sortKeyPage', {flag: FLAG_LANGUAGE.flag_language})*/}
      {/*}}>Sort Languages</Text>*/}

      {/*/!*Remove Pages*!/*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*navigate('customKeyPage', {isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key})*/}
      {/*}}>Remove Key</Text>*/}

      {/*/!*Reset*!/*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)*/}
      {/*Alert.alert(*/}
      {/*'Note',*/}
      {/*'Do you want to reset keys?',*/}
      {/*[*/}
      {/*{text: 'NO', onPress: () => {}},*/}
      {/*{text: 'YES', onPress: () => languageDao.resetKeys()},*/}
      {/*],*/}
      {/*{cancelable: false}*/}
      {/*)*/}
      {/*}}>Reset Default Keys</Text>*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)*/}
      {/*Alert.alert(*/}
      {/*'Note',*/}
      {/*'Do you want to reset languages?',*/}
      {/*[*/}
      {/*{text: 'NO', onPress: () => {}},*/}
      {/*{text: 'YES', onPress: () => languageDao.resetLangs()},*/}
      {/*],*/}
      {/*{cancelable: false}*/}
      {/*)*/}
      {/*}}>Reset Default Languages</Text>*/}

      {/*/!*Star and Unstar*!/*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*userDao.starRepo('apple/turicreate')*/}
      {/*.then(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Starred')*/}
      {/*})*/}
      {/*.catch(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Please Login...')*/}
      {/*})*/}
      {/*}}>Star</Text>*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*userDao.unstarRepo('apple/turicreate')*/}
      {/*.then(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Unstarred')*/}
      {/*})*/}
      {/*.catch(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Please Login...')*/}
      {/*})*/}
      {/*}}>Unstar</Text>*/}
      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*userDao.checkIfRepoStarred('apple/turicreate')*/}
      {/*.then((result) => {*/}
      {/*if (result === 1)*/}
      {/*DeviceEventEmitter.emit('showToast', 'starred')*/}
      {/*else*/}
      {/*DeviceEventEmitter.emit('showToast', 'Not starred')*/}
      {/*})*/}
      {/*.catch(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Please Login...')*/}
      {/*})*/}
      {/*}}>Check if starred</Text>*/}

      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*userDao.fetchStarredRepos()*/}
      {/*.then(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Starred')*/}
      {/*})*/}
      {/*.catch(() => {*/}
      {/*DeviceEventEmitter.emit('showToast', 'Please Login...')*/}
      {/*})*/}
      {/*}}>Starred Repos</Text>*/}

      {/*<Text style={styles.tips}*/}
      {/*onPress={() => {*/}
      {/*this.favoriteDao.reloadStarredRepos()*/}
      {/*DeviceEventEmitter.emit('showToast', 'Reloaded')*/}
      {/*}}>Reload Repos</Text>*/}
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60,
    backgroundColor: 'white',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
