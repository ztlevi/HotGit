import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  Linking,
  View,
  Clipboard,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../util/ViewUtils';
import { MORE_MENU } from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon, { FLAT_ABOUT } from './AboutCommon';
import { config } from '../../../res/data/config';
import FLAG from '../../../res/data/myinfo.json';
import Toast, { DURATION } from 'react-native-easy-toast';

export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(
      props,
      dic => this.updateState(dic),
      FLAT_ABOUT.flag_about_me,
      config
    );
    this.state = {
      projectModels: [],
      author: config.author,
      showRepository: false,
      showBlog: false,
      showContact: false,
    };
  }

  updateState(dic) {
    this.setState(dic);
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  /**
   * get item's right icon
   * @param isShow
   */
  getClickIcon(isShow) {
    return isShow ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
  }

  onClick(tab) {
    let TargetComponent,
      params = { ...this.props, menuType: tab };
    switch (tab) {
      case FLAG.REPOSITORY:
        this.updateState({ showRepository: !this.state.showRepository });
        break;
      case FLAG.BLOG:
        this.updateState({ showBlog: !this.state.showBlog });
        break;
      case FLAG.CONTACT:
        this.updateState({ showContact: !this.state.showContact });
        break;
      case FLAG.CONTACT.items.TWITTER:
        Clipboard.setString(tab.account);
        this.toast.show('twitter ' + tab.account + ' has been copied');
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, { ...params });
    }
  }

  /**
   * Show list items
   * @param dic
   * @param isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) return null;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount
        ? dic[i].title + ': ' + dic[i].account
        : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtils.getSettingItem(
            () => this.onClick(dic[i]),
            null,
            title,
            '#2196F3'
          )}
          <View style={GlobalStyles.line} />
        </View>
      );
    }
    return views;
  }

  render() {
    let content = (
      <View>
        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.BLOG),
          'computer',
          FLAG.BLOG.name,
          '#2196F3',
          this.getClickIcon(this.state.showBlog)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showBlog ? this.renderItems(FLAG.BLOG.items) : null}

        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.REPOSITORY),
          'code',
          FLAG.REPOSITORY.name,
          '#2196F3',
          this.getClickIcon(this.state.showRepository)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showRepository
          ? this.aboutCommon.renderRepository(FLAG.REPOSITORY.items, true)
          : null}

        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.CONTACT),
          'contacts',
          FLAG.CONTACT.name,
          '#2196F3',
          this.getClickIcon(this.state.showContact)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showContact
          ? this.renderItems(FLAG.CONTACT.items, true)
          : null}
      </View>
    );

    return (
      <View style={styles.container}>
        {this.aboutCommon.render(content, this.state.author)}
        <Toast ref={e => (this.toast = e)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
