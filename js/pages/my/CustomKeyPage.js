import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  Alert,
} from 'react-native'
import ViewUtils from '../../util/ViewUtils'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import Checkbox from 'react-native-check-box'
import ArrayUtils from '../../util/ArrayUtils'

export default class CustomKeyPage extends Component {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.changeValues = []
    this.state = {
      dataArray: []
    }
  }

  componentDidMount () {
    this.loadData()
  }

  loadData () {
    this.languageDao.fetch()
      .then(result => {
        this.setState({
          dataArray: result
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderCheckBox (data) {
    let leftText = data.name
    console.log(leftText)
    console.log(typeof(leftText))
    return (
      <View style={{flex: 1, padding: 10}}>
        <Checkbox
          leftText={leftText}
          onClick={() => this.onClick(data)}
          isChecked={data.checked}
          checkedImage={<Image
            style={{tintColor: '#2196F3'}}
            source={require('./images/ic_check_box.png')}/>}
          unCheckedImage={<Image
            style={{tintColor: '#2196F3'}}
            source={require('./images/ic_check_box_outline_blank.png')}/>}
        />
      </View>
    )
  }

  renderView () {
    if (!this.state.dataArray || this.state.dataArray.length === 0) return null
    let len = this.state.dataArray.length
    let views = []
    for (let i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(this.state.dataArray[i])}
            {this.renderCheckBox(this.state.dataArray[i + 1])}
          </View>
          <View style={styles.line}></View>
        </View>
      )
    }
    // deal with the rest keys
    views.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
          {this.renderCheckBox(this.state.dataArray[len - 1])}
        </View>
        <View style={styles.line}></View>
      </View>
    )

    return views
  }

  onSave () {
    if (this.changeValues.length === 0) {
      this.props.navigation.goBack()
      return
    }
    this.languageDao.save(this.state.dataArray)
    this.props.navigation.goBack()
  }

  onClick (data) {
    data.checked = !data.checked
    ArrayUtils.updateArray(this.changeValues, data)
  }

  onBack () {
    if (this.changeValues.length === 0) {
      this.props.navigation.goBack()
      return
    }
    Alert.alert(
      'Note',
      'Do you want to save?',
      [
        {text: 'NO', onPress: () => this.props.navigation.goBack()},
        {text: 'YES', onPress: () => this.onSave()},
      ],
      {cancelable: false}
    )
  }

  render () {
    let rightButton = <TouchableOpacity
      onPress={() => this.onSave()}
      style={{padding: 10}}
    >
      <View styl={{flex: 1}}>
        <Text style={styles.title}>Save</Text>
      </View>
    </TouchableOpacity>

    let leftButton = ViewUtils.getLeftButton(() => this.onBack())

    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        {title: 'Custom Tags'},
        leftButton,
        rightButton
      )}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tips: {
    fontSize: 29
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  line: {
    backgroundColor: 'darkgray',
    height: 0.3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
