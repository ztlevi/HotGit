import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ListView,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native';

import ComponentWithNavigationBar from '../common/NavigatorBar';
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository';
import PopularCell from '../common/PopularCell';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import LanguageDAO, { FLAG_LANGUAGE } from '../expand/dao/LanguageDAO';
import ProjectModel from '../model/ProjectModel';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import Utils from '../util/Utils';
import ViewUtils from '../util/ViewUtils';
import ActionUtils from '../util/ActionUtils';
import GlobalStyles from '../../res/styles/GlobalStyles';
import { Icon } from 'react-native-elements';
import makeCancelalbe from '../util/Cancelable';
import MoreMenu, { MORE_MENU } from '../common/MoreMenu';
import { FLAG_TAB } from './HomePage';
import BaseComponent from './BaseComponent';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
let favoriteDAO = new FavoriteDAO();
let dataRepository = new DataRepository();

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
  iconSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class PopularPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.languageDAO = new LanguageDAO(FLAG_LANGUAGE.flag_key);
    this.state = {
      result: '',
      loading: false,
      languages: [],
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadData();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
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

  renderRightButton() {
    return (
      <View style={GlobalStyles.header_icon}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('searchPage', {
              ...this.props,
            });
          }}
        >
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
        {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
      </View>
    );
  }

  renderMoreView() {
    let params = { ...this.props, fromPage: FLAG_TAB.flag_popularTab };
    return (
      <MoreMenu
        {...params}
        ref="moreMenu"
        menus={[
          MORE_MENU.Custom_Key,
          MORE_MENU.Sort_Key,
          MORE_MENU.Remove_Key,
          MORE_MENU.About_Author,
          MORE_MENU.About,
        ]}
        anchorView={this.refs.moreMenuButton}
      />
    );
  }

  render() {
    // might need to use Container because View does not work
    let content =
      this.state.languages.length > 0 ? (
        <ScrollableTabView
          tabBarBackgroundColor={this.props.theme.themeColor}
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2 }}
          initialPage={0}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {this.state.languages.map((result, i, arr) => {
            let lan = arr[i];
            return lan.checked ? (
              <PopularTab key={i} tabLabel={lan.name} {...this.props} />
            ) : null;
          })}
        </ScrollableTabView>
      ) : null;
    let title = <Text style={GlobalStyles.titleText}>Popular</Text>;

    let rightButton = this.renderRightButton();

    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(
          title,
          null,
          rightButton,
          this.props.theme.themeColor
        )}
        {content}
        {this.renderMoreView()}
      </View>
    );
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.items = [];
    this.isFavorteChanged = false;
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      favoriteKeys: [],
      theme: this.props.theme,
    };
    this.pageNum = 0;
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged', () => {
      this.isFavorteChanged = true;
    });
    this.loadData(true, true);
    this.load_more_listener = DeviceEventEmitter.addListener(
      'popular_load_more',
      () => this.loadData(false, true)
    );
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
    if (this.isFavorteChanged) {
      this.isFavorteChanged = false;
      this.getFavoriteKeys();
    } else if (nextProps.theme !== this.props.theme) {
      this.updateState({ theme: nextProps.theme });
      this.flushFavoriteState();
    }

    // if (!nextProps)
    //   this.loadData(false, false)
  }

  genFetchUrl(label) {
    return URL + label + QUERY_STR + '&order=desc';
  }

  getDataSource(data) {
    return this.state.dataSource.cloneWithRows(data);
  }

  getFavoriteKeys() {
    favoriteDAO
      .getFavoriteKeys()
      .then(keys => {
        keys = keys ? keys : [];
        this.updateState({ favoriteKeys: keys });
        this.flushFavoriteState();
      })
      .catch(() => {
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

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  loadData(showLoading, loadMore) {
    if (showLoading) {
      this.setState({
        isLoading: true,
      });
    }
    if (loadMore) {
      this.pageNum++;
    }
    let url = this.genFetchUrl(this.props.tabLabel) + '&page=' + this.pageNum;
    this.cancelable = makeCancelalbe(dataRepository.fetchRepository(url));
    this.cancelable.promise
      .then(result => {
        let itemArr =
          result && result.items ? result.items : result ? result : [];

        if (
          result &&
          result.update_date &&
          !Utils.checkDate(result.update_date)
        ) {
          return dataRepository.fetchNetRepository(url);
        } else {
          this.items.push(...itemArr);
          this.getFavoriteKeys();
        }
      })
      .then(items => {
        if (!items || items.length === 0) return;
        this.items.push(...items);
        this.getFavoriteKeys();
      })
      .catch(error => {
        this.updateState({
          result: JSON.stringify(error),
        });
      });
  }

  renderRow(projectModel) {
    return (
      <PopularCell
        {...this.props}
        key={projectModel.item.full_name}
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
            FLAG_STORAGE.flag_popular
          )
        }
        projectModel={projectModel}
      />
    );
  }

  _onScroll(e) {
    let windowHeight = Dimensions.get('window').height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;

    // loadData only when scrolled to bottom
    if (
      offset > 0 &&
      windowHeight - offset < 10 &&
      windowHeight + offset >= height
    ) {
      this.loadData(false, true);
    }
  }

  render() {
    const { theme } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderRow(data)}
          onScroll={e => this._onScroll(e)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true, false)}
              color={[theme.themeColor]}
              tintColor={theme.themeColor}
              title={'Loading...'}
              titleColor={theme.themeColor}
            />
          }
        />
      </View>
    );
  }
}
