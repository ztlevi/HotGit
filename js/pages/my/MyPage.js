import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'

export default class MyPage extends Component {
  constructor (props) {
    super(props)
  }

  // static navigationOptions = ({navigation}) => ({
  //   this.props = navigation.state.params;
  // });
  render () {

    const {navigate} = this.props.navigation
    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: 'My'},)}
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage')
            }}>Custom Tag</Text>

      <Text style={styles.tips}
            onPress={() => {
              navigate('sortKeyPage')
            }}>Sort Tag</Text>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
  }
})
