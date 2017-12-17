import React, { Component } from 'react'
import {
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../util/ViewUtils'

export default class SortKeyPage extends Component {
  constructor (props) {
    super(props)
    this.dataArray = []
    this.sortResultArray = []
    this.originalCheckedArray = []
    this.state = {
      checkedArray: []
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
        this.getCheckedItems(result)
      })
      .catch(error => {

      })
  }

  getCheckedItems (result) {
    this.dataArray = result
    let checkedArray = []
    for (let i = 0, len = result.length; i < len; i++) {
      let data = result[i]
      if (data.checked) checkedArray.push(data)
    }
    this.setState({
      checkedArray: checkedArray,
    })
    this.originalCheckedArray = ArrayUtils.clone(checkedArray)
  }

  onBack () {
    if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
      this.props.navigation.goBack()
      return
    }
    Alert.alert(
      'Note',
      'Do you want to save modification?',
      [
        {text: 'NO', onPress: () => this.props.navigation.goBack()},
        {text: 'YES', onPress: () => this.onSave(true)},
      ],
      {cancelable: false}
    )

  }

  onSave (idChecked) {
    if (!idChecked && ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
      this.props.navigation.goBack()
      return
    }
    this.getSortResult()
    this.languageDao.save(this.sortResultArray)
    this.props.navigation.goBack()
  }

  getSortResult () {
    this.sortResultArray = ArrayUtils.clone(this.dataArray)
    for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
      let item = this.originalCheckedArray[i]
      let index = this.dataArray.indexOf(item)
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
  }

  render () {
    const {navigate} = this.props.navigation
    console.log(this.state.checkedArray)
    let order = Object.keys(this.state.checkedArray)

    let leftButton = ViewUtils.getLeftButton(() => this.onBack())
    let rightButton = ViewUtils.getRightButton(() => this.onBack(), 'Save')

    let title = this.flag === FLAG_LANGUAGE.flag_language ? 'Sort Language' : 'Sort Key'
    let titleText = <Text style={styles.titleText}>{title}</Text>

    return <View style={styles.container}>
      {ComponentWithNavigationBar(titleText, leftButton, rightButton)}
      <SortableListView
        data={this.state.checkedArray}
        order={order}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row}/>}
      >
      </SortableListView>
    </View>
  }
}

class SortCell extends Component {
  render () {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        delayLongPress={500}
        style={styles.item}
        {...this.props.sortHandlers}
      >
        <View style={styles.row}>
          <Image source={require('./images/ic_reorder_36pt.png')}
                 style={styles.image}/>
          <Text style={{fontWeight: 'bold'}}>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
  },
  item: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    tintColor: '#2196F3',
    height: 16,
    width: 16,
    marginRight: 10,
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
