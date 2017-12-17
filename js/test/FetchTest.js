import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import NavigatorBar from '../common/NavigatorBar'
import HttpUtils from './HttpUtils'

export default class Fetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ""
    }
  }

  load(url) {
    HttpUtils.get(url)
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

  post(url, data) {
    HttpUtils.post(url, data)
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

  render() {
    return (
      <View style={styles.container}>
        <NavigatorBar
          title={"Fetch Usage"}
        />
        <Text style={styles.tips}
              onPress={() => this.load("http://rap2api.taobao.org/app/mock/1061/GET/test")}
        >
          fetch data
        </Text>
        <Text style={styles.tips}
              onPress={() => this.post("http://rap2api.taobao.org/app/mock/1061/POST/submit"
                , {userName: 'XiaoMing', password: '123456'})}
        >
          submit data
        </Text>
        <Text>Return result: {this.state.result}</Text>
      </View>
    )
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    text: {
      fontSize: 22
    }
  })
