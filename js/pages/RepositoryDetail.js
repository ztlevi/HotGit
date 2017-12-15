import React, {
  Component
} from 'react'
import {
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  WebView,
  DeviceEventEmitter,
} from 'react-native'
import ComponentWithNavigationBar from '../common/NavigatorBar'
import ViewUtils from '../util/ViewUtils'

const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
  constructor (props) {
    super(props)
    const {state} = this.props.navigation
    let item = state.params.projectModel.item
    this.url = item.html_url ? item.html_url : TRENDING_URL + item.fullName
    let title = item.full_name ? item.full_name : item.fullName
    this.state = {
      url: this.url,
      title: title,
      canGoBack: false,
    }
  }

  goBack () {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
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

  render () {
    let leftButton = ViewUtils.getLeftButton(() => this.goBack())
    let titleWidth = 25
    let titleShrinked = this.state.title.length > titleWidth ? this.state.title.substring(0, titleWidth) + '...' : this.state.title
    let title = <Text style={styles.titleText}>{titleShrinked}</Text>
    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        title,
        leftButton,
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