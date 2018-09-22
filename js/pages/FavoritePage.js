import {
  View,
  StyleSheet,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import React, { Component } from 'react';

import { FLAG_STORAGE } from '../expand/dao/DataRepository';
import { FLAG_TAB } from './HomePage';
import ActionUtils from '../util/ActionUtils';
import ArrayUtils from '../util/ArrayUtils';
import BaseComponent from './BaseComponent';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import GlobalStyles from '../../res/styles/GlobalStyles';
import MoreMenu, { MORE_MENU } from '../common/MoreMenu';
import PopularCell from '../common/PopularCell';
import ProjectModel from '../model/ProjectModel';
import TrendingCell from '../common/TrendingCell';
import ViewUtils from '../util/ViewUtils';

let favoriteDAO = new FavoriteDAO();

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
});

export default class FavoritePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      reload: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    // use DidMount to reload page
    // reload does not mean anything, just used to refresh
    // the page so that the refs can be found
    this.updateState({
      reload: true,
    });
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  renderMoreView() {
    let params = { ...this.props, fromPage: FLAG_TAB.flag_favoriteTab };
    return (
      <MoreMenu
        {...params}
        ref="moreMenu"
        menus={[MORE_MENU.About_Author, MORE_MENU.About]}
        anchorView={this.refs.moreMenuButton}
      />
    );
  }

  renderRightButton() {
    return (
      <View>{ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}</View>
    );
  }

  render() {
    let content = <FavoriteTab {...this.props} />;
    let title = <Text style={GlobalStyles.titleText}>Favorite</Text>;
    let rightButton = this.renderRightButton();

    return (
      <View style={GlobalStyles.root_container}>
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

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.unFavoriteItems = [];
    this.state = {
      result: '',
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      favoriteKeys: [],
    };
  }

  componentDidMount() {
    this.loadData(true, true);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(false, false);
  }

  getDataSource(data) {
    return this.state.dataSource.cloneWithRows(data);
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  loadData(showLoading, isRefresh) {
    if (showLoading) {
      this.setState({
        isLoading: true,
      });
    }
    favoriteDAO
      .getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        this.updateState({
          isLoading: false,
          dataSource: this.getDataSource(resultData),
        });
      })
      .catch(e => {
        this.updateState({
          isLoading: false,
        });
      });

    // reload online starred repos when refresh
    if (isRefresh) favoriteDAO.reloadStarredRepos();
  }

  /**
   * favoriteIcon click callback function
   * @param item
   */
  onFavorite(item) {
    ArrayUtils.updateArray(this.unFavoriteItems, item);
    if (this.unFavoriteItems.length > 0) {
      DeviceEventEmitter.emit('favoriteChanged');
    }
  }

  renderRow(projectModel) {
    if (projectModel.item.full_name) {
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
          onFavorite={(item, isFavorite) => {
            ActionUtils.onFavorite(
              favoriteDAO,
              item,
              isFavorite,
              FLAG_STORAGE.flag_popular
            );
            this.onFavorite(item);
          }}
          projectModel={projectModel}
        />
      );
    } else {
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
  }
  render() {
    const { theme } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderRow(data)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true, true)}
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
