import React, {
  Component
} from 'react'
import {
  View,
  Image,
  Button,
  TextInput,
  Text,
  StyleSheet,
  WebView,
  DeviceEventEmitter,
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import ComponentWithNavigationBar from '../common/NavigatorBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDAO from '../expand/dao/FavoriteDAO'

favoriteDAO = new FavoriteDAO()

const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
  constructor (props) {
    super(props)
    const {state} = this.props.navigation
    this.projectModel = state.params.projectModel
    let item = state.params.projectModel.item
    this.url = item.html_url ? item.html_url : TRENDING_URL + item.fullName
    let title = item.full_name ? item.full_name : item.fullName
    this.state = {
      url: this.url,
      title: title,
      canGoBack: false,
      isFavorite: this.projectModel.isFavorite,
      favoriteIcon: this.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
    }
  }

  goBack () {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
      // set callback function to re-render the icon status when go back
      this.props.navigation.state.params.callback(this.state.isFavorite)
    }
  }

  go () {
    this.setState({
      url: this.text
    })
  }

  onNavigationStateChange (e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url,
    })
  }

  setFavoriteState (isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
    })
  }

  onRightButtonClick () {
    let projectModel = this.projectModel
    let item = projectModel.item
    this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite)
    let key = item.fullName ? item.fullName : item.full_name

    if (projectModel.isFavorite) {
      favoriteDAO.saveFavoriteItem('id_' + key, JSON.stringify(item))
    } else {
      favoriteDAO.removeFavoriteItem('id_' + key, JSON.stringify(item))
    }
  }

  render () {
    let leftButton = ViewUtils.getLeftButton(() => this.goBack())

    let rightButtonImage = <Image
      style={{width: 20, height: 20, marginRight: 10}}
      source={this.state.favoriteIcon}
    />
    let rightButton = ViewUtils.getRightButtonImage(() => this.onRightButtonClick(), rightButtonImage)
    let titleWidth = 22
    let titleShrinked = this.state.title.length > titleWidth ? this.state.title.substring(0, titleWidth) + '...' : this.state.title
    let title = <Text style={styles.titleText}>{titleShrinked}</Text>
    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        title,
        leftButton,
        rightButton
      )}
      <WebView
        ref={webView => this.webView = webView}
        source={{uri: this.state.url}}
        startInLoadingState={true}
        onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
      />
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    margin: 2
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})