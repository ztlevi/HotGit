import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  ListView,
  RefreshControl,
  Text,
} from 'react-native'
import { Container } from 'native-base'
import NavigatorBar from '../common/NavigatorBar'
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.datarespository = new DataRepository()
    this.state = {
      result: '',
      loading: false,
    }
  }

  render () {
    return <Container style={styles.container}>
      <NavigatorBar
        title={'Popular'}
      />
      <ScrollableTabView
        tabBarBackgroundColor="#2196F3"
        tabBarInactiveTextColor="mintcream"
        tabBarActiveTextColor="white"
        tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
        initialPage={0}
        style={{height: 60}}
        renderTabBar={() => <ScrollableTabBar/>}
      >
        <PopularTab tabLabel="Java">JAVA</PopularTab>
        <PopularTab tabLabel="IOS">IOS</PopularTab>
        <PopularTab tabLabel="Android">android</PopularTab>
        <PopularTab tabLabel="JavaScript">js</PopularTab>
      </ScrollableTabView>
    </Container>
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

  loadData () {
    this.setState({
      isLoading:true,
    })
    let url = URL + this.props.tabLabel + QUERY_STR
    this.datarespository.fetchNetRepository(url)
      .then(result => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(result.items),
          isLoading:false,
        })
      })
      .catch(error => {
        this.setState({
          result: JSON.stringify(error)
        })
      })

  }

  renderRow (data) {
    return <RepositoryCell data={data}/>
  }

  render () {
    return (<View style={{flex:1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={()=>this.loadData()}
              color={["#2196F3"]}
              tintColor={"#2196F3"}
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