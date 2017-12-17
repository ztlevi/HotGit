import React, { Component } from 'react'
import {
  View,
  Image,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  DeviceEventEmitter,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import Toast, { DURATION } from 'react-native-easy-toast'
import UserDao from '../../expand/dao/UserDao'
import ViewUtils from '../../util/ViewUtils'

export default class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.username = 'ztlevitest'
    this.password = 'helloTest1'
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
    let userDao = new UserDao()
    const {navigate, goBack} = this.props.navigation

    let titleText = <Text style={styles.titleText}>Login</Text>
    let leftButton = ViewUtils.getLeftButton(() => goBack())
    return (
      <View sytle={styles.container}>
        {ComponentWithNavigationBar(titleText, leftButton)}
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
        <Text style={styles.tips}
              onPress={() => {
                userDao.login(this.username, this.password)
              }}>Login</Text>
        <Text style={styles.tips}
              onPress={() => {
                userDao.logout()
              }}>Logout</Text>
        <Toast ref={toast => this.toast = toast}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
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
    margin: 10,
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
