import React, { Component } from 'react'
import {
  StackNavigator,
} from 'react-navigation'
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import PopularPage from './PopularPage'
import CustomKeyPage from './my/CustomKeyPage'
import MyPage from './my/MyPage'

// init
const Root = StackNavigator({
  welcomePage: {screen: WelcomePage},
  homePage: {screen: HomePage},
  popularPage: {screen: PopularPage},

  myPage: {screen: MyPage},
  customKeyPage: {screen: CustomKeyPage},
}, {
  headerMode: 'none'
})

export default class setup extends Component {
  render () {
    // return <HomePage/>
    return <Root/>
  }
}
