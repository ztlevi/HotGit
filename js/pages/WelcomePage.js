import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../common/NavigatorBar'
import GlobalStyles from '../../res/styles/GlobalStyles'

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
    let title = <Text style={GlobalStyles.titleText}>Welcome Page</Text>
    return <View style={styles.container}>
      {ComponentWithNavigationBar(title)}
      <Text>Welcome!</Text>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    flex: 1
  },
})
