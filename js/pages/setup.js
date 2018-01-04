import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import WelcomePage from './WelcomePage';
import HomePage from './HomePage';
import PopularPage from './PopularPage';
import CustomKeyPage from './my/CustomKeyPage';
import MyPage from './my/MyPage';
import SortKeyPage from './my/SortKeyPage';
import RepositoryDetail from './RepositoryDetail';
import LoginPage from './my/LoginPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import AboutPage from './about/AboutPage';
import WebViewPage from './WebViewPage';
import AboutMePage from './about/AboutMePage';
import SearchPage from './SearchPage';

const mapNavigationStateParamsToProps = SomeComponent => {
  return class extends Component {
    static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
    render() {
      const { navigation: { state: { params } } } = this.props;
      return <SomeComponent {...params} {...this.props} />;
    }
  };
};

// init
const Root = StackNavigator(
  {
    welcomePage: { screen: mapNavigationStateParamsToProps(WelcomePage) },
    homePage: { screen: mapNavigationStateParamsToProps(HomePage) },
    popularPage: { screen: mapNavigationStateParamsToProps(PopularPage) },
    trendingPage: { screen: mapNavigationStateParamsToProps(TrendingPage) },
    favoritePage: { screen: mapNavigationStateParamsToProps(FavoritePage) },
    repositoryDetailPage: {
      screen: mapNavigationStateParamsToProps(RepositoryDetail),
    },
    searchPage: { screen: mapNavigationStateParamsToProps(SearchPage) },

    // my pages
    myPage: { screen: mapNavigationStateParamsToProps(MyPage) },
    loginPage: { screen: mapNavigationStateParamsToProps(LoginPage) },
    customKeyPage: { screen: mapNavigationStateParamsToProps(CustomKeyPage) },
    sortKeyPage: { screen: mapNavigationStateParamsToProps(SortKeyPage) },

    //about page
    aboutPage: { screen: mapNavigationStateParamsToProps(AboutPage) },
    aboutMePage: { screen: mapNavigationStateParamsToProps(AboutMePage) },
    webViewPage: { screen: mapNavigationStateParamsToProps(WebViewPage) },
  },
  {
    headerMode: 'none',
  }
);

export default class setup extends Component {
  render() {
    // return <HomePage/>
    return <Root />;
  }
}
