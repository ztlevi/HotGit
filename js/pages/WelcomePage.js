import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import NavigatorBar from '../common/NavigatorBar'

export default class WelcomePage extends Component {
  static navigationOptions = {
    title: 'Welcome Page',
  };

  componentDidMount() {
    const {navigate} = this.props.navigation;
    setTimeout(() => {
      navigate('homePage')
    }, 2000);
  }

  componentWillUnmount() {
    this.timer&&clearTimeout(this.timer);
  }

  render() {
    return <View>
      <NavigatorBar
        title={'Welcome'}
      />
      <Text>Welcome!</Text>
    </View>
  }
}