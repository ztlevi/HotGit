import React, {Component} from 'react'
import {
  StackNavigator,
} from 'react-navigation';
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'

// init
const Root = StackNavigator({
  welcomePage: {screen: WelcomePage},
  homePage:{screen:HomePage}
}, {
  headerMode: 'none'
});

export default class setup extends Component {
  render() {
    return <Root />
  }
}
