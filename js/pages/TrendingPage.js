import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Button,
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
// import Popover from '../common/Popover'

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
      {ComponentWithNavigationBar({title: this.renderTitleView()})}
      {content}
    </View>
  }

  renderTitleView () {
    return <View style={{width: 100, height: 30, alignContent: 'center'}}>
      <TouchableOpacity
        onPress={this.openPopover}
        ref={r => this.button = r}
        onLayout={this.setLayout}
      >
        <View style={styles.title}>
          <Text
            style={{fontSize: 20, color: 'white', fontWeight: '400', marginLeft: -30}}>Trending</Text>
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
    this.setState({isVisible: true})
  }
  closePopover = () => {
    this.setState({isVisible: false})
  }

  onSelectTimeSpan (timeSpan) {
    this.setState({
      timeSpan: timeSpan,
      isVisible: false,
    })
  }
}

class TrendingTab extends Component {
  constructor (props) {
    super(props)
    this.datarespository = new DataRepository(FLAG_STORAGE.flag_trending)
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
    // this.pageNum = 1
  }

  componentDidMount () {
    this.loadData(this.props.timeSpan, true)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan)
    }
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  onSelect (item) {
    const {navigate} = this.props.navigation
    navigate('repositoryDetailPage', {item: item})
  }

  genFetchUrl (timeSpan, category) {
    let url = API_URL + category + '?' + timeSpan.searchText
    return url
  }

  onRefresh () {
    this.loadData(this.props.timeSpan)
  }

  loadData (timeSpan, isRefresh) {
    this.updateState({
      isLoading: true,
    })
    let url = this.genFetchUrl(timeSpan, this.props.tabLabel)
    this.datarespository.fetchNetRepository(url)
      .then(result => {
        let items = result && result.items ? result.items : result ? result : []
        this.updateState({
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
        this.updateState({
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
    return <TrendingCell
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
              onRefresh={() => this.onRefresh()}
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
})