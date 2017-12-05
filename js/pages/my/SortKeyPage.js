import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../../common/NavigatorBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'

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
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
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

  render () {

    let testdata = {
      hello: { text: 'world' },
      how: { text: 'are you' },
      test: { text: 123 },
      this: { text: 'is' },
      a: { text: 'a' },
      real: { text: 'real' },
      drag: { text: 'drag and drop' },
      bb: { text: 'bb' },
      cc: { text: 'cc' },
      dd: { text: 'dd' },
      ee: { text: 'ee' },
      ff: { text: 'ff' },
      gg: { text: 'gg' },
      hh: { text: 'hh' },
      ii: { text: 'ii' },
      jj: { text: 'jj' },
      kk: { text: 'kk' },
    }

    const {navigate} = this.props.navigation
    console.log(this.state.checkedArray)
    let order = Object.keys(this.state.checkedArray)
    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: 'My'},)}
      <SortableListView
        data={this.state.checkedArray}
        order={order}
        onRowMoved={e => {
          order.splice(e.to, 0, order.splice(e.from, 1)[0])
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
    return <View>
      <Text>{this.props.data.name}</Text>
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
