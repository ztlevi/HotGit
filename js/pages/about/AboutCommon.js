import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../util/ViewUtils';
import FavoriteDAO from '../../expand/dao/FavoriteDAO';
import { FLAG_STORAGE } from '../../expand/dao/DataRepository';
import Utils from '../../util/Utils';
import ActionUtils from '../../util/ActionUtils';
import RepositoryCell from '../../common/PopularCell';
import RepositoryUtils from '../../expand/dao/RepositoryUtils';
import { Icon } from 'react-native-elements';

let favoriteDAO = new FavoriteDAO();

export var FLAT_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me',
  flag_user: 'user',
};

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 0,
    top: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    justifyContent: 'space-between',
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
  },
  sectionTitleText: {
    padding: 8,
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    paddingVertical: 5,
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 20,
  },
});
export default class AboutCommon {
  constructor(props, updateState, flag_about, config) {
    this.props = props;
    this.updateState = updateState;
    this.flag_about = flag_about;
    this.repositories = [];
    this.config = config;
    this.favoriteKeys = null;
    this.favoriteDao = new FavoriteDAO();
    this.repositoryUtils = new RepositoryUtils(this);
  }

  componentDidMount() {
    if (this.flag_about === FLAT_ABOUT.flag_about) {
      this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
    } else {
      let urls = [];
      let items = this.config.items;
      for (let i = 0, l = items.length; i < l; i++) {
        urls.push(this.config.info.url + items[i]);
      }
      this.repositoryUtils.fetchRepositories(urls);
    }
  }

  /**
   * notify data has changed
   * @param items
   */
  onNotifyDataChanged(items) {
    this.updateFavorite(items);
  }

  /**
   * update favorite
   * @param repositories
   */
  async updateFavorite(repositories) {
    if (repositories) this.repositories = repositories;
    if (!this.repositories) return;
    if (!this.favoriteKeys) {
      this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
    }
    let projectModels = [];
    for (let i = 0, len = this.repositories.length; i < len; i++) {
      let data = this.repositories[i];
      data = data.item ? data.item : data;
      projectModels.push({
        isFavorite: Utils.checkFavorite(
          data,
          this.favoriteKeys ? this.favoriteKeys : []
        ),
        item: data.item ? data.item : data,
      });
    }
    this.updateState({
      projectModels: projectModels,
    });
  }

  setFavoriteState(isFavorite) {
    this.isFavorite = isFavorite;
    this.favoriteIcon = isFavorite ? 'star' : 'star-border';
  }

  /**
   * favoriteIcon click callback function
   * @param item
   * @param isFavorite
   */
  onFavorite(item, isFavorite) {
    if (isFavorite) {
      favoriteDAO.saveFavoriteItem(
        'id_' + item.full_name.toString(),
        JSON.stringify(item)
      );
    } else {
      favoriteDAO.removeFavoriteItem(
        'id_' + item.full_name.toString(),
        JSON.stringify(item)
      );
    }
  }

  /**
   * Create project view
   * @param projectModels
   * @returns {*}
   */
  renderRepository(projectModels) {
    if (!projectModels || projectModels.length === 0) return null;
    let views = [];
    for (let i = 0, l = projectModels.length; i < l; i++) {
      let projectModel = projectModels[i];
      views.push(
        <RepositoryCell
          {...this.props}
          key={projectModel.item.full_name}
          onSelect={() => {
            ActionUtils.onSelectRepository({
              projectModel: projectModel,
              ...this.props,
              callback: isFavorite => this.setFavoriteState(isFavorite),
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
    return views;
  }

  getParallaxScrollRenderConfig(params) {
    let config = {};
    config.renderBackground = () => (
      <View key="background">
        <Image
          style={{ width: window.width, height: PARALLAX_HEADER_HEIGHT }}
          source={params.backgroundImg}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        {typeof params.avatar === 'string' ? (
          <Image
            style={[styles.avatar, { width: AVATAR_SIZE, height: AVATAR_SIZE }]}
            source={{ uri: params.avatar }}
          />
        ) : typeof params.avatar === 'number' ? (
          <Image
            style={[styles.avatar, { width: AVATAR_SIZE, height: AVATAR_SIZE }]}
            source={params.avatar}
          />
        ) : (
          <Icon name="account-circle" size={AVATAR_SIZE} color="white" />
        )}
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => this.props.navigation.goBack())}
      </View>
    );

    return config;
  }

  render(contentView, params) {
    let renderConfig = this.getParallaxScrollRenderConfig(params);
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor="#2196F3"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}
      >
        {contentView}
      </ParallaxScrollView>
    );
  }
}
