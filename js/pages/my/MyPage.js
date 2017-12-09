import React, { Component } from 'react'
import {
  View,
  Alert,
  StyleSheet,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'

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
      <Text style={styles.tips}
            onPress={() => {
              navigate('customKeyPage', {isRemoveKey: true})
            }}>Remove Tag</Text>
      <Text style={styles.tips}
            onPress={() => {
              let languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
              Alert.alert(
                'Note',
                'Do you want to reset tags?',
                [
                  {text: 'NO', onPress: () => {}},
                  {text: 'YES', onPress: () => languageDao.reset()},
                ],
                {cancelable: false}
              )
            }}>Reset Tags</Text>
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
