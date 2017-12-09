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

const URL = 'https://www.google.com'
export default class RepositoryDetail extends Component {
  constructor (props) {
    super(props)
    const {state} = this.props.navigation
    let item = state.params.item
    this.url = item.html_url
    let title = item.full_name
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
    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        {title: this.state.title},
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
  }
})