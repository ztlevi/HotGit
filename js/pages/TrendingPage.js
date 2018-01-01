import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  findNodeHandle,
  NativeModules,
  TouchableOpacity,
  ListView,
  Platform,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository';
import TrendingCell from '../common/TrendingCell';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import LanguageDAO, { FLAG_LANGUAGE } from '../expand/dao/LanguageDAO';
import TimeSpan from '../model/TimeSpan';
import Popover from 'react-native-modal-popover';
import ProjectModel from '../model/ProjectModel';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import makeCancelable from '../util/Cancelable';
import Utils from '../util/Utils';
import ViewUtils from '../util/ViewUtils';
import MoreMenu, { MORE_MENU } from '../common/MoreMenu';
import ActionUtils from '../util/ActionUtils';
import GlobalStyles from '../../res/styles/GlobalStyles';
import { Icon } from 'react-native-elements';
import { FLAG_TAB } from './HomePage';

let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
let favoriteDAO = new FavoriteDAO();

const API_URL = 'https://github.com/trending/';
let timeSpanTextArray = [
  new TimeSpan('Daily', 'since=daily'),
  new TimeSpan('Weekly', 'since=weekly'),
  new TimeSpan('Monthly', 'since=monthly'),
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.languageDAO = new LanguageDAO(FLAG_LANGUAGE.flag_language);
    this.state = {
      result: '',
      loading: false,
      isVisible: false,
      languages: [],
      timeSpan: timeSpanTextArray[0],
      buttonReact: {},
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.languageDAO
      .fetch()
      .then(result => {
        this.setState({
          languages: result,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  showPopover = () => {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonReact: { x: px, y: py, width: width, height: height },
      });
    });
  };

  closePopover = () => {
    this.updateState({ isVisible: false });
  };

  onSelectTimeSpan(timeSpan) {
    this.setState({
      timeSpan: timeSpan,
      isVisible: false,
    });
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  renderMoreView() {
    let params = { ...this.props, fromPage: FLAG_TAB.flag_trendingTab };
    return (
      <MoreMenu
        {...params}
        ref="moreMenu"
        menus={[
          MORE_MENU.Custom_Language,
          MORE_MENU.Sort_Language,
          MORE_MENU.Custom_Theme,
          MORE_MENU.About_Author,
          MORE_MENU.About,
        ]}
        anchorView={this.refs.moreMenuButton}
      />
    );
  }

  renderTitleView() {
    return (
      <View style={{ alignContent: 'center' }}>
        <TouchableOpacity onPress={this.showPopover} ref="button">
          <View style={styles.title}>
            <Text style={GlobalStyles.titleText}>Trending</Text>
            <Text
              style={{
                marginLeft: 8,
                fontSize: 18,
                color: 'white',
                fontWeight: '400',
              }}
            >
              {this.state.timeSpan.showText}
            </Text>
            <Icon
              name="keyboard-arrow-down"
              size={22}
              color="white"
              containerStyle={{ marginRight: 5 }}
            />
          </View>
        </TouchableOpacity>
        <Popover
          visible={this.state.isVisible}
          fromRect={this.state.buttonReact}
          onClose={() => this.closePopover()}
          contentStyle={styles.content}
          placement="bottom"
          arrowStyle={styles.arrow}
          backgroundStyle={styles.background}
        >
          {timeSpanTextArray.map((result, i, arr) => {
            return (
              <TouchableOpacity
                key={i}
                underlayColor="transparent"
                onPress={() => this.onSelectTimeSpan(arr[i])}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '400',
                    padding: 8,
                    textAlign: 'center',
                  }}
                >
                  {arr[i].showText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Popover>
      </View>
    );
  }
  render() {
    // might need to use Container because View does not work
    let content =
      this.state.languages.length > 0 ? (
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2 }}
          initialPage={0}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {this.state.languages.map((result, i, arr) => {
            let lan = arr[i];
            return lan.checked ? (
              <TrendingTab
                key={i}
                tabLabel={lan.name}
                path={lan.path}
                timeSpan={this.state.timeSpan}
                {...this.props}
              />
            ) : null;
          })}
        </ScrollableTabView>
      ) : null;

    let rightButton = (
      <View
        style={{
          padding: 5,
          paddingTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
      </View>
    );

    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(this.renderTitleView(), null, rightButton)}
        {content}
        {this.renderMoreView()}
      </View>
    );
  }
}

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.isFavorteChanged = false;
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      favoriteKeys: [],
    };
    this.pageNum = 0;
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged', () => {
      this.isFavorteChanged = true;
    });
    this.loadData(this.props.timeSpan, true);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
    if (this.load_more_listener) {
      this.load_more_listener.remove();
    }
    this.cancelable && this.cancelable.cancel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan, true);
    } else if (this.isFavorteChanged) {
      this.isFavorteChanged = false;
      this.getFavoriteKeys();
      this.loadData(this.props.timeSpan, false);
    }
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  genFetchUrl(timeSpan, category) {
    let url = API_URL + category + '?' + timeSpan.searchText;
    return url;
  }

  getFavoriteKeys() {
    favoriteDAO
      .getFavoriteKeys()
      .then(keys => {
        keys = keys ? keys : [];
        this.updateState({ favoriteKeys: keys });
        this.flushFavoriteState();
      })
      .catch(e => {
        this.flushFavoriteState();
      });
  }

  /**
   * Update project item favorite status
   */
  flushFavoriteState() {
    let projectModels = [];
    let items = this.items;
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(
        new ProjectModel(
          items[i],
          Utils.checkFavorite(items[i], this.state.favoriteKeys)
        )
      );
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
    });
  }

  getDataSource(data) {
    return this.state.dataSource.cloneWithRows(data);
  }

  loadData(timeSpan, showLoading) {
    if (showLoading) {
      this.updateState({
        isLoading: true,
      });
    }
    let url = this.genFetchUrl(timeSpan, this.props.path);
    /* this.cancelable = makeCancelable(dataRepository.fetchRepository(url));
     * this.cancelable.promise*/
    dataRepository
      .fetchRepository(url)
      .then(result => {
        this.items =
          result && result.items ? result.items : result ? result : [];
        this.getFavoriteKeys();
        if (
          result &&
          result.update_date &&
          !Utils.checkDate(result.update_date)
        ) {
          return dataRepository.fetchNetRepository(url);
        }
      })
      .then(items => {
        if (!items || items.length === 0) return;
        this.items = items;
        this.getFavoriteKeys();
      })
      .catch(error => {
        console.log(error);
        this.updateState({
          isLoading: false,
        });
      });
  }

  renderRow(projectModel) {
    return (
      <TrendingCell
        {...this.props}
        key={projectModel.item.fullName}
        onSelect={() => {
          ActionUtils.onSelectRepository({
            projectModel: projectModel,
            ...this.props,
          });
        }}
        onFavorite={(item, isFavorite) =>
          ActionUtils.onFavorite(
            favoriteDAO,
            item,
            isFavorite,
            FLAG_STORAGE.flag_trending
          )
        }
        projectModel={projectModel}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderRow(data)}
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
    );
  }
}
