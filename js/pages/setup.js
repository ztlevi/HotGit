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
import LoginPage from './my/LoginPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import AboutPage from './about/AboutPage'
import WebViewPage from './WebViewPage'
import AboutMePage from './about/AboutMePage'

// init
const Root = StackNavigator({
  welcomePage: {screen: WelcomePage},
  homePage: {screen: HomePage},
  popularPage: {screen: PopularPage},
  trendingPage: {screen: TrendingPage},
  favoritePage: {screen: FavoritePage},
  repositoryDetailPage: {screen: RepositoryDetail},

  // my pages
  myPage: {screen: MyPage},
  loginPage: {screen: LoginPage},
  customKeyPage: {screen: CustomKeyPage},
  sortKeyPage:{screen:SortKeyPage},

  //about page
  aboutPage: {screen: AboutPage},
  aboutMePage: {screen: AboutMePage},
  webViewPage:{screen: WebViewPage}
}, {
  headerMode: 'none'
})

export default class setup extends Component {
  render () {
    // return <HomePage/>
    return <Root/>
  }
}
