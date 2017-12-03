import React, {Component} from 'react'
import {
  StackNavigator,
} from 'react-navigation';
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import PopularPage from './PopularPage'

// init
const Root = StackNavigator({
  welcomePage: {screen: WelcomePage},
  homePage:{screen:HomePage},
  popularPage:{screen:PopularPage}
}, {
  headerMode: 'none'
});

export default class setup extends Component {
  render() {
    return <Root />
  }
}
