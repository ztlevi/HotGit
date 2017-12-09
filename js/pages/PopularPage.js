import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../common/NavigatorBar'
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.datarespository = new DataRepository()
    this.state = {
      result: '',
      loading: false,
      languages: [],
    }
  }

  componentDidMount () {
    this.loadData()
  }

  loadData () {
    this.languageDao.fetch()
      .then(result => {
        this.setState({
          languages: result
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render () {
    // might need to use Container because View does not work
    let content = this.state.languages.length > 0 ? <ScrollableTabView
      tabBarBackgroundColor="#2196F3"
      tabBarInactiveTextColor="mintcream"
      tabBarActiveTextColor="white"
      tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
      initialPage={0}
      style={{height: 40}}
      renderTabBar={() => <ScrollableTabBar/>}
    >
      {this.state.languages.map((result, i, arr) => {
        let lan = arr[i]
        return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab> : null
      })}
    </ScrollableTabView> : null
    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: 'Popular'})}
      {content}
    </View>
  }
}

class PopularTab extends Component {
  constructor (props) {
    super(props)
    this.datarespository = new DataRepository()
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount () {
    this.loadData()
  }

  onSelect (item) {
    const {navigate} = this.props.navigation
    navigate('repositoryDetailPage', {item: item})
  }

  loadData () {
    this.setState({
      isLoading: true,
    })
    let url = URL + this.props.tabLabel + QUERY_STR
    this.datarespository.fetchRepository(url)
      .then(result => {
        let items = result && result.items ? result.items : result ? result : []
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items),
          isLoading: false,
        })
        if (result && result.update_date && !this.datarespository.checkDate(result.update_date)) {
          DeviceEventEmitter.emit('showToast', 'Data outdated')
          return this.datarespository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit('showToast', 'Show cached data')
        }
      })
      .then(items => {
        if (!items || items.length === 0) return
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items),
        })
        DeviceEventEmitter.emit('showToast', 'Show network data')
      })
      .catch(error => {
        this.setState({
          result: JSON.stringify(error)
        })
      })
  }

  renderRow (data) {
    return <RepositoryCell
      onSelect={() => this.onSelect(data)}
      data={data}/>
  }

  render () {
    return (<View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
              color={['#2196F3']}
              tintColor={'#2196F3'}
              title={'Loading...'}
              titleColor={'#2196F3'}
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    // flex: 1,
    // padding: 10,
    // backgroundColor: 'rgba(0,0,0,0.01)',
  },
  tips: {
    fontSize: 29,
  },
})