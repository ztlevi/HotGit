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
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
import FavoriteDAO from '../expand/dao/FavoriteDAO'
import Utils from '../util/Utils'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
let favoriteDAO = new FavoriteDAO()

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
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
      renderTabBar={() => <ScrollableTabBar/>}
    >
      {this.state.languages.map((result, i, arr) => {
        let lan = arr[i]
        return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab> : null
      })}
    </ScrollableTabView> : null
    let title = <Text style={{fontSize: 20, color: 'white', fontWeight: '400'}}>Popular</Text>

    return <View style={styles.container}>
      {ComponentWithNavigationBar({title: title})}
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
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      favoriteKeys: []
    }
    // this.pageNum = 1
  }

  componentDidMount () {
    this.loadData()
  }

  onSelect (projectModel) {
    const {navigate} = this.props.navigation
    navigate('repositoryDetailPage', {projectModel: projectModel})
  }

  genFetchUrl (label) {
    return URL + label + QUERY_STR //+ '?page=' + this.pageNum
  }

  getDataSource (data) {
    return this.state.dataSource.cloneWithRows(data)
  }

  getFavoriteKeys () {
    favoriteDAO.getFavoriteKeys()
      .then(keys => {
        keys = keys ? keys : []
        this.updateState({favoriteKeys: keys})
        this.flushFavoriteState()
      })
      .catch(e => {
        this.flushFavoriteState()
      })
  }

  /**
   * Update project item favorite status
   */
  flushFavoriteState () {
    let projectModels = []
    let items = this.items
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
    })
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  loadData () {
    this.setState({
      isLoading: true,
    })
    let url = this.genFetchUrl(this.props.tabLabel)
    this.datarespository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : result ? result : []
        this.getFavoriteKeys()
        if (result && result.update_date && !this.datarespository.checkDate(result.update_date)) {
          DeviceEventEmitter.emit('showToast', 'Data outdated')
          return this.datarespository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit('showToast', 'Show cached data')
        }
      })
      .then(items => {
        if (!items || items.length === 0) return
        this.items = items
        this.getFavoriteKeys()
        DeviceEventEmitter.emit('showToast', 'Show network data')
      })
      .catch(error => {
        this.updateState({
          result: JSON.stringify(error)
        })
      })
  }

  /**
   * favoriteIcon click callback function
   * @param item
   * @param isFavorite
   */
  onFavorite (item, isFavorite) {
    if (isFavorite) {
      favoriteDAO.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
    } else {
      favoriteDAO.removeFavoriteItem(item.id.toString(), JSON.stringify(item))
    }
  }

  renderRow (projectModel) {
    return <RepositoryCell
      {...this.props}
      key={projectModel.item.id}
      onSelect={() => this.onSelect(projectModel)}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      projectModel={projectModel}/>
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
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  tips: {
    fontSize: 29,
  },
})