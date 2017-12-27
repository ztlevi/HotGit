import React, { Component } from 'react';
import {
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  WebView,
  DeviceEventEmitter,
} from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';

const URL = 'https://www.google.com';
export default class WebViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: URL,
      title: '',
      canGoBack: false,
    };
  }

  goBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      DeviceEventEmitter.emit('showToast', 'Cannot go back');
    }
  }

  go() {
    this.setState({
      url: this.text,
    });
  }

  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      title: e.title,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar({ title: 'Web view usage' })}
        <View style={styles.row}>
          <Text style={styles.tips} onPress={() => this.goBack()}>
            Return
          </Text>
          <TextInput
            style={styles.input}
            defaultValue={URL}
            onChangeText={text => (this.text = text)}
          />
          <Text style={styles.tips} onPress={() => this.go()}>
            Go
          </Text>
        </View>
        <WebView
          ref={webView => (this.webView = webView)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    );
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
    margin: 2,
  },
});
