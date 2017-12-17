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
    this.changeValues = []
    const {state} = this.props.navigation
    try {
      this.isRemoveKey = !!state.params.isRemoveKey
    } catch (e) {
      this.isRemoveKey = false
    }
    this.state = {
      dataArray: []
    }
  }

  componentDidMount () {
    const {state} = this.props.navigation
    this.flag = state.params.flag
    this.languageDao = new LanguageDao(this.flag)
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
    let isChecked = this.isRemoveKey ? false : data.checked
    console.log(leftText)
    console.log(typeof(leftText))
    return (
      <View style={{flex: 1, padding: 10}}>
        <Checkbox
          leftText={leftText}
          onClick={() => this.onClick(data)}
          isChecked={isChecked}
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
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtils.remove(this.state.dataArray, this.changeValues[i])
      }
    }
    this.languageDao.save(this.state.dataArray)
    this.props.navigation.goBack()
  }

  onClick (data) {
    if (!this.isRemoveKey)
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
    let title = this.isRemoveKey ? 'Remove Key' : 'Custom Key'
    title = this.flag === FLAG_LANGUAGE.flag_language ? 'Custom Language' : title
    let rightButtonTitle = this.isRemoveKey ? 'Remove' : 'Save'
    let rightButton = ViewUtils.getRightButton(() => this.onBack, rightButtonTitle)

    let titleText = <Text style={styles.titleText}>{title}</Text>
    let leftButton = ViewUtils.getLeftButton(() => this.onBack())

    return <View style={styles.container}>
      {ComponentWithNavigationBar(
        titleText,
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
  line: {
    backgroundColor: 'darkgray',
    height: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
