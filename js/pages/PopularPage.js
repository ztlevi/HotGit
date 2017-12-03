import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import NavigatorBar from '../common/NavigatorBar'
import DataRepository from '../expand/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.datarespository = new DataRepository()
    this.state = {
      result: ''
    }
  }

  render () {
    return <View>
      <NavigatorBar
        title={'Popular'}
        style={{backgroundColor: '#6495ED'}}
      />
      <ScrollableTabView
        renderTabBar={() => <ScrollableTabBar/>}
      >
        <PopularTab tabLabel="Java">Java</PopularTab>
        <PopularTab tabLabel="IOS">IOS</PopularTab>
        <PopularTab tabLabel="Android">android</PopularTab>
        <PopularTab tabLabel="JavaScript">js</PopularTab>
      </ScrollableTabView>
    </View>
  }
}

class PopularTab extends Component {
  constructor (props) {
    super(props)
    this.datarespository = new DataRepository()
    this.state = {
      result: ''
    }
  }

  componentDidMount(){
    this.loadData();
  }

  loadData () {
    // let url = URL + this.props.tabLabel + QUERY_STR
    let url = ''
    this.datarespository.fetchNetRepository(url)
    this.datarespository.fetchNetRepository(url)
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
    return <View>
      <Text style={{height:600}}>{this.state.result}</Text>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29,
  }
})