import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import { MORE_MENU } from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon, { FLAT_ABOUT } from './AboutCommon';
import { config } from '../../../res/data/config';

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(
      props,
      dic => this.updateState(dic),
      FLAT_ABOUT.flag_about,
      config
    );
    this.state = {
      projectModels: [],
    };
  }

  updateState(dic) {
    this.setState(dic);
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  onClick(tab) {
    let TargetComponent,
      params = { ...this.props, menuType: tab };
    switch (tab) {
      case MORE_MENU.About_Author:
        TargetComponent = 'aboutMePage';
        break;
      case MORE_MENU.Website:
        TargetComponent = 'webViewPage';
        params.url = 'https://ztlevi.github.io';
        params.title = 'My Blog';
        break;
      case MORE_MENU.Feedback:
        let url = 'mailto://ztlevi1993@gmail.com';
        Linking.canOpenURL(url)
          .then(supported => {
            if (!supported) {
              console.log("Can't handle url: " + url);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch(err => console.error('An error occurred', err));
        break;
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, { ...params });
    }
  }

  render() {
    let content = (
      <View>
        {this.aboutCommon.renderRepository(this.state.projectModels)}
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.Website),
          'computer',
          MORE_MENU.Website,
          '#2196F3'
        )}
        <View style={GlobalStyles.line} />
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.About_Author),
          'mood',
          MORE_MENU.About_Author,
          '#2196F3'
        )}
        <View style={GlobalStyles.line} />
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.Feedback),
          'feedback',
          MORE_MENU.Feedback,
          '#2196F3'
        )}
        <View style={GlobalStyles.line} />
      </View>
    );
    return this.aboutCommon.render(content, {
      name: 'Github Popular',
      description:
        "This is a Github Mobile App built with React Native. This app aims to help developers keep tracking on Github's popular repositories.",
      avatar: config.author.avatar1,
      backgroundImg: config.author.backgroundImg1,
    });
  }
}
