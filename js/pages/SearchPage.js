import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  Dimensions,
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
} from 'react-native';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../../res/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import RepositoryCell from '../common/PopularCell';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import ProjectModel from '../model/ProjectModel';
import Utils from '../util/Utils';
import ActionUtils from '../util/ActionUtils';

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
  title: {
    fontSize: 18,
    textAlign: 'center',
    width: 60,
    color: 'white',
    fontWeight: '500',
  },
});

let favoriteDAO = new FavoriteDAO();

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.favoriteKeys = [];
    this.state = {
      rightButtonText: 'Go',
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
    this.pageNum = 0;
    this.items = [];
  }

  loadData(loadMore) {
    this.updateState({
      isLoading: true,
    });
    if (loadMore) {
      this.pageNum++;
    }
    let url = this.genFetchUrl(this.inputKey) + '&page=' + this.pageNum;

    fetch(url)
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

  componentWillMount() {}

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
      this.loadData(true);
    } else {
      this.updateState({
        rightButtonText: 'Go',
        isLoading: false,
      });
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
          <Text style={styles.title}>{this.state.rightButtonText}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: '#2196F3',
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
      <RepositoryCell
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
      console.log('End Scroll');
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
            backgroundColor: '#2196F3',
          }}
        />
      );
    }
    let listView = (
      <ListView
        dataSource={this.state.dataSource}
        onScroll={e => this._onScroll(e)}
        renderRow={e => this.renderRow(e)}
      />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {listView}
        <Toast
          ref={toast => {
            this.toast = toast;
          }}
        />
      </View>
    );
  }
}
