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
import ComponentWithNavigationBar from './js/common/NavigatorBar'
import GitHubTrending from 'GitHubTrending'

const URL = 'https://github.com/trending/'

export default class TrendingTest extends Component {
  constructor (props) {
    super(props)
    this.trending = new GitHubTrending()
    this.state = {
      result: ''
    }
  }

  onLoad () {
    let url = URL + this.text
    this.trending.fetchTrending(url)
      .then(result => {
        this.setState({
          result: JSON.stringify(result)
        })
      })
      .catch(error => {
        this.setState({
          result: JSON.stringify(error)
        })
      })
  }

  render () {
    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        {title: 'Github Trending Test'},
      )}
      <TextInput
        style={styles.input}
        onChangeText={text => this.text = text}
      />
      <Text
        style={styles.tips}
        onPress={() => this.onLoad()}
      >Load</Text>
      <Text style={{flex: 1}}>{this.state.result}</Text>
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
    height: 30,
    borderWidth: 1,
  }
})