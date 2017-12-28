import React, { Component } from 'react';
import { View, Text, WebView } from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';

export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.navigation;
    this.state = {
      url: state.params.url,
      title: state.params.title,
      canGoBack: false,
    };
  }

  onBackPress() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }

  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
    });
  }

  render() {
    let titleText = (
      <Text style={GlobalStyles.titleText}>{this.state.title}</Text>
    );
    let leftButton = ViewUtils.getLeftButton(() => this.onBackPress());
    return (
      <View style={GlobalStyles.root_container}>
        {ComponentWithNavigationBar(titleText, leftButton)}
        <WebView
          ref={webView => (this.webView = webView)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    );
  }
}
