import React, { Component } from 'react'
import {
  View,
  Image,
  Alert,
  StyleSheet,
  Text,
  DeviceEventEmitter,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import DataRepository from '../../expand/dao/DataRepository'
import FavoriteDAO from '../../expand/dao/FavoriteDAO'
import UserDao from '../../expand/dao/UserDao'

export default class MyPage extends Component {
  constructor (props) {
    super(props)
    this.favDao = new FavoriteDAO()
  }

  render () {
    let title = <Text style={styles.titleText}>My Account</Text>
    let userDao = new UserDao()

    const {navigate} = this.props.navigation
    return <View style={styles.container}>
      {ComponentWithNavigationBar(title)}
      <View
        style={styles.row}
      >
        <Image
          style={{width: 50, height: 50, tintColor: 'red'}}
          source={require('../../../res/images/ic_whatshot_36pt.png')}
        ></Image>
        <Text style={styles.tips}
              onPress={() => {
                navigate('loginPage')
              }}
        >Login</Text>
      </View>
      {/*Custom Pages*/}
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage', {flag: FLAG_LANGUAGE.flag_key})
            }}>Custom Key</Text>
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage', {flag: FLAG_LANGUAGE.flag_language})
            }}>Custom Languages</Text>

      {/*Sort Pages*/}
      <Text style={styles.tips}
            onPress={() => {
              navigate('sortKeyPage', {flag: FLAG_LANGUAGE.flag_language})
            }}>Sort Key</Text>
      <Text style={styles.tips}
            onPress={() => {
              navigate('sortKeyPage', {flag: FLAG_LANGUAGE.flag_language})
            }}>Sort Languages</Text>

      {/*Remove Pages*/}
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage', {isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key})
            }}>Remove Key</Text>

      {/*Reset*/}
      <Text style={styles.tips}
            onPress={() => {
              let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
              Alert.alert(
                'Note',
                'Do you want to reset keys?',
                [
                  {text: 'NO', onPress: () => {}},
                  {text: 'YES', onPress: () => languageDao.resetKeys()},
                ],
                {cancelable: false}
              )
            }}>Reset Default Keys</Text>
      <Text style={styles.tips}
            onPress={() => {
              let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
              Alert.alert(
                'Note',
                'Do you want to reset languages?',
                [
                  {text: 'NO', onPress: () => {}},
                  {text: 'YES', onPress: () => languageDao.resetLangs()},
                ],
                {cancelable: false}
              )
            }}>Reset Default Languages</Text>

      {/*Star and Unstar*/}
      <Text style={styles.tips}
            onPress={() => {
              userDao.starRepo('apple/turicreate')
                .then(() => {
                  DeviceEventEmitter.emit('showToast', 'Starred')
                })
                .catch(() => {
                  DeviceEventEmitter.emit('showToast', 'Please Login...')
                })
            }}>Star</Text>
      <Text style={styles.tips}
            onPress={() => {
              userDao.unstarRepo('apple/turicreate')
                .then(() => {
                  DeviceEventEmitter.emit('showToast', 'Unstarred')
                })
                .catch(() => {
                  DeviceEventEmitter.emit('showToast', 'Please Login...')
                })
            }}>Unstar</Text>
      <Text style={styles.tips}
            onPress={() => {
              userDao.checkIfRepoStarred('apple/turicreate')
                .then((result) => {
                  if (result === 1)
                    DeviceEventEmitter.emit('showToast', 'starred')
                  else
                    DeviceEventEmitter.emit('showToast', 'Not starred')
                })
                .catch(() => {
                  DeviceEventEmitter.emit('showToast', 'Please Login...')
                })
            }}>Check if starred</Text>

      <Text style={styles.tips}
            onPress={() => {
              userDao.fetchStarredRepos()
                .then(() => {
                  DeviceEventEmitter.emit('showToast', 'Starred')
                })
                .catch(() => {
                  DeviceEventEmitter.emit('showToast', 'Please Login...')
                })
            }}>Starred Repos</Text>

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
    alignItems: 'center',
    margin: 10,
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
