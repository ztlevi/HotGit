import React, { Component } from 'react'
import {
  StackNavigator,
} from 'react-navigation'
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import PopularPage from './PopularPage'
import CustomKeyPage from './my/CustomKeyPage'
import MyPage from './my/MyPage'
import SortKeyPage from './my/SortKeyPage'
import RepositoryDetail from './RepositoryDetail'

// init
const Root = StackNavigator({
  welcomePage: {screen: WelcomePage},
  homePage: {screen: HomePage},
  popularPage: {screen: PopularPage},
  repositoryDetailPage: {screen: RepositoryDetail},

  // my pages
  myPage: {screen: MyPage},
  customKeyPage: {screen: CustomKeyPage},
  sortKeyPage:{screen:SortKeyPage},
}, {
  headerMode: 'none'
})

export default class setup extends Component {
  render () {
    // return <HomePage/>
    return <Root/>
  }
}
