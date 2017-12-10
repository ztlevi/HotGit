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
import UserDao from '../../expand/dao/UserDao'

export default class MyPage extends Component {
  constructor (props) {
    super(props)
  }

  // static navigationOptions = ({navigation}) => ({
  //   this.props = navigation.state.params;
  // });
  render () {
    let userDao = new UserDao()

    const {navigate} = this.props.navigation
    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: 'My'},)}
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
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage')
            }}>Custom Tag</Text>

      <Text style={styles.tips}
            onPress={() => {
              navigate('sortKeyPage')
            }}>Sort Tag</Text>
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage', {isRemoveKey: true})
            }}>Remove Tag</Text>
      <Text style={styles.tips}
            onPress={() => {
              let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
              Alert.alert(
                'Note',
                'Do you want to reset tags?',
                [
                  {text: 'NO', onPress: () => {}},
                  {text: 'YES', onPress: () => languageDao.reset()},
                ],
                {cancelable: false}
              )
            }}>Reset Tags</Text>
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

})
