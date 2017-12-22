import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  DeviceEventEmitter,
  Linking,
  View,
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtils from '../../util/ViewUtils'
import Toast, { DURATION } from 'react-native-easy-toast'
import { MORE_MENU } from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, { FLAT_ABOUT } from '../about/AboutCommon'
import UserDao from '../../expand/dao/UserDao'
import FavoriteDAO from '../../expand/dao/FavoriteDAO'
import { Button } from 'react-native-elements'

let userDao = new UserDao()

export default class LoginPage extends Component {
  constructor (props) {
    super(props)
    const {state} = this.props.navigation
    this.user = state.params.user
    this.username = 'ztlevitest'
    this.password = 'helloTest1'
    this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAT_ABOUT.flag_user)
  }

  updateState (dic) {
    this.setState(dic)
  }

  componentDidMount () {
    this.listener = DeviceEventEmitter.addListener('showLoginResult', (text) => {
      this.toast.show(text, DURATION.LENGTH_LONG)
    })
  }

  componentWillUnmount () {
    this.listener && this.listener.remove()
  }

  render () {
    let favoriteDao = new FavoriteDAO()
    const {state, goBack} = this.props.navigation

    let user = this.user
    let content
    if (user) {
      content = <View style={styles.row}>
        <Text style={styles.tips}
              onPress={() => {
                userDao.logout()
                goBack()
                state.params.logoutUser()
              }}>Logout</Text>
      </View>
    } else {
      content = <View>
        <View style={styles.row}>
          <Text
            style={styles.tips}
          >Username:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => this.username = text}
          />
        </View>
        <View style={styles.row}>
          <Text
            style={styles.tips}
          >Password:</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            onChangeText={text => this.password = text}
          />
        </View>
        <View style={styles.row}>
          <Button
            onPress={() => {
              userDao.login(this.username, this.password, () => {
                // use the callback function to load the user on
                // Account page when login failed
                goBack()
                state.params.loadUser()
              })
            }}
            buttonStyle={styles.button}
            backgroundColor='#2196F3'
            title='Login'/>
          <Button
            onPress={() => {
              userDao.logout()
              goBack()
              state.params.logoutUser()
            }}
            buttonStyle={styles.button}
            backgroundColor='#2196F3'
            title='Logout'/>
        </View>
        <Toast ref={toast => this.toast = toast}/>
      </View>
    }

    return this.aboutCommon.render(content, {
        'name': user ? user : 'Please login',
        // 'description': 'This is a Github Mobile App built with React Native. This app aims to help developers keep tracking on Github\'s popular repositories.',
        'avatar': require('../../../res/avatar/author.jpg'),
        'backgroundImg': require('../../../res/avatar/background.jpg')
      }
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 20,
    width: 100
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    margin: 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 10,
  },
  button :{
    width: 120,
    borderRadius:3
  }
})
