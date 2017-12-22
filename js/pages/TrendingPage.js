import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  findNodeHandle,
  NativeModules,
  TouchableOpacity,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native'
import ComponentWithNavigationBar from '../common/NavigatorBar'
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'
import TrendingCell from '../common/TrendingCell'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import TimeSpan from '../model/TimeSpan'
import Popover, { PopoverTouchable } from 'react-native-modal-popover'
import ProjectModel from '../model/ProjectModel'
import FavoriteDAO from '../expand/dao/FavoriteDAO'
import Utils from '../util/Utils'

let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
let favoriteDAO = new FavoriteDAO()

const API_URL = 'https://github.com/trending/'
let timeSpanTextArray = [
  new TimeSpan('Daily', 'since=daily'),
  new TimeSpan('Weekly', 'since=weekly'),
  new TimeSpan('Monthly', 'since=monthly')]

export default class TrendingPage extends Component {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
    this.state = {
      result: '',
      loading: false,
      isVisible: false,
      languages: [],
      timeSpan: timeSpanTextArray[0],
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
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

  setLayout = (e) => {
    const handle = findNodeHandle(this.button)
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({popoverAnchor: {x, y, width, height}})
      })
    }
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
        return lan.checked ?
          <TrendingTab key={i} tabLabel={lan.name} timeSpan={this.state.timeSpan} {...this.props}></TrendingTab> : null
      })}
    </ScrollableTabView> : null

    return <View style={styles.container}>
      {ComponentWithNavigationBar(this.renderTitleView())}
      {content}
    </View>
  }

  renderTitleView () {
    return <View style={{height: 30, alignContent: 'center'}}>
      <TouchableOpacity
        onPress={this.openPopover}
        ref={r => this.button = r}
        onLayout={this.setLayout}
      >
        <View style={styles.title}>
          <Text
            style={styles.titleText}>Trending</Text>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 18,
              color: 'white',
              fontWeight: '400'
            }}>{this.state.timeSpan.showText}</Text>
          <Image
            style={{width: 22, height: 22, marginLeft: 5, tintColor: 'white'}}
            source={require('../../res/images/ic_keyboard_arrow_down_36pt.png')}/>
        </View>
      </TouchableOpacity>
      <Popover
        visible={this.state.isVisible}
        fromRect={this.state.popoverAnchor}
        onClose={() => this.closePopover()}
        contentStyle={styles.content}
        placement='bottom'
        arrowStyle={styles.arrow}
        backgroundStyle={styles.background}
        // contentStyle={{backgroundColor:'#343434', opacity:0.82}}
      >
        {timeSpanTextArray.map((result, i, arr) => {
          return <TouchableOpacity
            key={i}
            underlayColor='transparent'
            onPress={() => this.onSelectTimeSpan(arr[i])}
          >
            <Text
              style={{fontSize: 18, fontWeight: '400', padding: 8}}
            >{arr[i].showText}</Text>
          </TouchableOpacity>
        })}
      </Popover>
    </View>
  }

  openPopover = () => {
    this.updateState({isVisible: true})
  }
  closePopover = () => {
    this.updateState({isVisible: false})
  }

  onSelectTimeSpan (timeSpan) {
    this.setState({
      timeSpan: timeSpan,
      isVisible: false,
    })
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }
}

class TrendingTab extends Component {
  constructor (props) {
    super(props)
    this.isFavorteChanged = false
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      favoriteKeys: [],
    }
    this.pageNum = 0
  }

  componentDidMount () {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged', () => {
      this.isFavorteChanged = true
    })
    this.loadData(this.props.timeSpan, true)
  }

  componentWillUnmount () {
    if (this.listener) {
      this.listener.remove()
    }
    if (this.load_more_listener) {
      this.load_more_listener.remove()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan, true)
    } else if (this.isFavorteChanged) {
      this.isFavorteChanged = false
      this.getFavoriteKeys()
    }
    this.loadData(this.props.timeSpan, false)
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  onSelect (projectModel) {
    const {navigate} = this.props.navigation
    navigate('repositoryDetailPage', {projectModel: projectModel})
  }

  genFetchUrl (timeSpan, category) {
    let url = API_URL + category + '?' + timeSpan.searchText
    return url
  }

  /**
   * favoriteIcon click callback function
   * @param item
   * @param isFavorite
   */
  onFavorite (item, isFavorite) {
    if (isFavorite) {
      favoriteDAO.saveFavoriteItem('id_' + item.fullName.toString(), JSON.stringify(item))
    } else {
      favoriteDAO.removeFavoriteItem('id_' + item.fullName.toString(), JSON.stringify(item))
    }
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

  getDataSource (data) {
    return this.state.dataSource.cloneWithRows(data)
  }

  loadData (timeSpan, showLoading) {
    if (showLoading) {
      this.updateState({
        isLoading: true,
      })
    }
    let url = this.genFetchUrl(timeSpan, this.props.tabLabel)
    dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : result ? result : []
        this.getFavoriteKeys()
        if (result && result.update_date && !Utils.checkDate(result.update_date)) {
          return dataRepository.fetchNetRepository(url)
        }
      })
      .then(items => {
        if (!items || items.length === 0) return
        this.items = items
        this.getFavoriteKeys()
      })
      .catch(error => {
        console.log(error)
        this.updateState({
          isLoading: false
        })
      })
  }

  renderRow (projectModel) {
    return <TrendingCell
      {...this.props}
      key={projectModel.item.fullName}
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
              onRefresh={() => this.loadData(this.props.timeSpan, true)}
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
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  tips: {
    fontSize: 29,
  },
  content: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  arrow: {
    borderTopColor: 'white',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  titleText: {fontSize: 20, color: 'white', fontWeight: '400'}
})
