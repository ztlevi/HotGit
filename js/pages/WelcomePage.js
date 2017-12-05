import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../common/NavigatorBar'

export default class WelcomePage extends Component {
  componentDidMount () {
    const {navigate} = this.props.navigation
    setTimeout(() => {
      navigate('homePage')
    }, 500)
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }

  render () {
    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: 'Welcome Page'})}
      <Text>Welcome!</Text>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    flex: 1
  }
})
