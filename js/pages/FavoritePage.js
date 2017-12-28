import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import RepositoryCell from '../common/RepositoryCell';
import ProjectModel from '../model/ProjectModel';
import ArrayUtils from '../util/ArrayUtils';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import TrendingCell from '../common/TrendingCell';
import GlobalStyles from '../../res/styles/GlobalStyles';

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

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let content = <FavoriteTab {...this.props} />;
    let title = <Text style={GlobalStyles.titleText}>Favorite</Text>;

    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(title)}
        {content}
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

  onSelect(projectModel) {
    const { navigate } = this.props.navigation;
    navigate('repositoryDetailPage', { projectModel: projectModel });
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
   * @param isFavorite
   */
  onFavorite(item, isFavorite) {
    let fullName = item.full_name ? item.full_name : item.fullName;
    if (isFavorite) {
      favoriteDAO.saveFavoriteItem(
        'id_' + fullName.toString(),
        JSON.stringify(item)
      );
    } else {
      favoriteDAO.removeFavoriteItem(
        'id_' + fullName.toString(),
        JSON.stringify(item)
      );
    }
    ArrayUtils.updateArray(this.unFavoriteItems, item);
    if (this.unFavoriteItems.length > 0) {
      DeviceEventEmitter.emit('favoriteChanged');
    }
  }

  renderRow(projectModel) {
    if (projectModel.item.full_name) {
      return (
        <RepositoryCell
          {...this.props}
          key={projectModel.item.full_name}
          onSelect={() => this.onSelect(projectModel)}
          onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
          projectModel={projectModel}
        />
      );
    } else {
      return (
        <TrendingCell
          {...this.props}
          key={projectModel.item.fullName}
          onSelect={() => this.onSelect(projectModel)}
          onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
          projectModel={projectModel}
        />
      );
    }
  }

  render() {
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
