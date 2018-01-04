import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  Dimensions,
  View,
  StyleSheet,
  DeviceEventEmitter,
  Platform,
  Text,
  ActivityIndicator,
  ListView,
} from 'react-native';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../../res/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import PopularCell from '../common/PopularCell';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import ProjectModel from '../model/ProjectModel';
import makeCancelable from '../util/Cancelable';
import Utils from '../util/Utils';
import ActionUtils from '../util/ActionUtils';
import LanguageDAO, { FLAG_LANGUAGE } from '../expand/dao/LanguageDAO';
import { ACTION_HOME, FLAG_TAB } from './HomePage';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const STATUS_BAR_HEIGHT = 20;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 30 : 40,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45,
    right: 10,
    borderRadius: 3,
  },
});

let favoriteDAO = new FavoriteDAO();

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.favoriteKeys = [];
    this.languageDAO = new LanguageDAO(FLAG_LANGUAGE.flag_key);
    this.keys = [];
    this.pageNum = 0;
    this.items = [];
    this.isKeyChanged = false;
    this.state = {
      rightButtonText: 'Go',
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      showBottomButton: false,
    };
  }

  componentDidMount() {
    this.initKeys();
  }
  componentWillUnmount() {
    if (this.isKeyChanged) {
      DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, {
        jumpToTab: FLAG_TAB.flag_popularTab,
      });
    }
  }

  /**
   * Add key
   */
  saveKey() {
    let key = this.inputKey;
    if (this.checkKeyIsExist(this.keys, key)) {
      this.toast.show(key + ' exists', DURATION.LENGTH_LONG);
    } else {
      key = {
        path: key,
        name: key,
        checked: true,
      };
      this.keys.unshift(key);
      this.languageDAO.save(this.keys);
      this.toast.show(key.name + ' is saved', DURATION.LENGTH_LONG);
      this.isKeyChanged = true;
    }
  }

  /**
   * Fetch all keys
   */
  async initKeys() {
    this.keys = await this.languageDAO.fetch();
  }

  /**
   * Check if key is exist in keys
   */
  checkKeyIsExist(keys, key) {
    for (let i = 0, l = keys.length; i < l; i++) {
      if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
    }
    return false;
  }

  loadData(loadMore) {
    this.updateState({
      isLoading: true,
    });
    if (loadMore) {
      this.pageNum++;
    }
    let url = this.genFetchUrl(this.inputKey) + '&page=' + this.pageNum;

    this.cancelable = makeCancelable(fetch(url));
    this.cancelable.promise
      .then(response => response.json())
      .then(responseData => {
        let itemArr =
          responseData && responseData.items
            ? responseData.items
            : responseData ? responseData : [];

        if (
          !this ||
          !responseData ||
          !responseData.items ||
          responseData.items.length === 0
        ) {
          this.toast.show(
            this.inputKey + ': nothing found',
            DURATION.LENGTH_LONG
          );
          this.updateState({ isLoading: false, rightButtonText: 'Go' });
          return;
        }

        this.items.push(...itemArr);
        this.getFavoriteKeys();
        if (!this.checkKeyIsExist(this.keys, this.inputKey)) {
          this.updateState({
            showBottomButton: true,
          });
        }
      })
      .catch(e => {
        this.updateState({
          isLoading: false,
          rightButtonText: 'Go',
        });
      });
  }

  getFavoriteKeys() {
    favoriteDAO
      .getFavoriteKeys()
      .then(keys => {
        this.favoriteKeys = keys || [];
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
      rightButtonText: 'Go',
    });
  }

  genFetchUrl(label) {
    return API_URL + label + QUERY_STR + '&order=desc';
  }

  getDataSource(data) {
    return this.state.dataSource.cloneWithRows(data);
  }

  onBackPress() {
    this.refs.input.blur();
    this.props.navigation.goBack();
  }

  updateState(dic) {
    this.setState(dic);
  }

  onRightButtonClick() {
    if (this.state.rightButtonText === 'Go') {
      this.updateState({ rightButtonText: 'Cancel' });
      this.items = [];
      this.pageNum = 0;
      this.loadData(true);
    } else {
      this.updateState({
        rightButtonText: 'Go',
        isLoading: false,
      });
      this.cancelable && this.cancelable.cancel();
    }
  }

  renderNavBar() {
    let backButton = ViewUtils.getLeftButton(() => this.onBackPress());
    let inputView = (
      <TextInput
        ref="input"
        onChangeText={text => (this.inputKey = text)}
        style={styles.textInput}
      />
    );
    let rightButton = (
      <TouchableOpacity
        onPress={() => {
          this.refs.input.blur();
          this.onRightButtonClick();
        }}
      >
        <View style={{ marginRight: 10 }}>
          <Text style={[styles.title, { width: 60 }]}>
            {this.state.rightButtonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: this.props.theme.themeColor,
          flexDirection: 'row',
          alignItems: 'center',
          height:
            Platform.OS === 'ios'
              ? GlobalStyles.nav_bar_height_ios
              : GlobalStyles.nav_bar_height_android,
        }}
      >
        {backButton}
        {inputView}
        {rightButton}
      </View>
    );
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
          ActionUtils.onFavorite(favoriteDAO, item, isFavorite)
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
      this.loadData(true);
    }
  }

  render() {
    let statusBar = null;
    if (Platform.OS === 'ios') {
      statusBar = (
        <View
          style={{
            height:
              Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : STATUS_BAR_HEIGHT,
            backgroundColor: this.props.theme.themeColor,
          }}
        />
      );
    }
    let listView = !this.state.isLoading ? (
      <ListView
        dataSource={this.state.dataSource}
        onScroll={e => this._onScroll(e)}
        renderRow={e => this.renderRow(e)}
      />
    ) : null;
    let indicatorView = this.state.isLoading ? (
      <ActivityIndicator
        style={styles.centering}
        size="large"
        animating={this.state.isLoading}
      />
    ) : null;
    let resultView = (
      <View style={{ flex: 1 }}>
        {indicatorView}
        {listView}
      </View>
    );
    let bottomButton = this.state.showBottomButton ? (
      <TouchableOpacity
        style={[
          styles.bottomButton,
          { backgroundColor: this.props.theme.themeColor },
        ]}
        onPress={() => {
          this.saveKey();
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.title}>Add custom key</Text>
        </View>
      </TouchableOpacity>
    ) : null;
    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast
          ref={toast => {
            this.toast = toast;
          }}
        />
      </View>
    );
  }
}
