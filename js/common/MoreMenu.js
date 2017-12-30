/**
 * More Menu
 */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Linking,
  Platform,
  View,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Popover from 'react-native-modal-popover';
import GlobalStyles from '../../res/styles/GlobalStyles';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDAO';

export const MORE_MENU = {
  Login: 'Login',
  Custom_Language: 'Custom Language',
  Sort_Language: 'Sort Language',
  Custom_Key: 'Custom Key',
  Sort_Key: 'Sort Key',
  Remove_Key: 'Remove Key',
  Custom_Theme: 'Custom Theme',
  About_Author: 'About Author',
  About: 'About',
  Website: 'Website',
  Feedback: 'Feedback',
  Share: 'Share',
};

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
    borderTopColor: 'transparent',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      buttonReact: {},
    };
  }

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    menus: PropTypes.array.isRequired,
    anchorView: PropTypes.object,
  };

  open() {
    this.showPopover();
  }

  showPopover = () => {
    if (!this.props.anchorView) return;
    let anchorView = this.props.anchorView;
    anchorView.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonReact: { x: px, y: py, width: width, height: height },
      });
    });
  };

  closePopover = () => {
    this.updateState({ isVisible: false });
  };

  updateState(dic) {
    this.setState(dic);
  }

  onMoreMenuSelect(tab) {
    this.closePopover();
    let TargetComponent,
      params = { ...this.props, menuType: tab };
    switch (tab) {
      case MORE_MENU.Custom_Language:
        TargetComponent = 'customKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Key:
        TargetComponent = 'customKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Remove_Key:
        TargetComponent = 'customKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        params.isRemoveKey = true;
        break;
      case MORE_MENU.Sort_Key:
        TargetComponent = 'sortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        TargetComponent = 'sortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Login:
        TargetComponent = 'loginPage';
        params.user = this.state.user;
        params.avatar_url = this.state.user_avatar;
        params.loadUser = () => this.loadUser();
        params.logoutUser = () => this.logoutUser();
        break;
      case MORE_MENU.Custom_Theme:
        break;
      case MORE_MENU.About_Author:
        TargetComponent = 'aboutMePage';
        break;
      case MORE_MENU.About:
        TargetComponent = 'aboutPage';
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
      case MORE_MENU.Share:
        TargetComponent = 'aboutPage';
        break;
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, { ...params });
    }
  }

  renderMoreView() {
    let width = GlobalStyles.window_width;
    let os_height = Platform.OS === 'ios' ? 20 : 0;

    let view = (
      <Popover
        visible={this.state.isVisible}
        fromRect={this.state.buttonReact}
        onClose={() => this.closePopover()}
        contentStyle={styles.content}
        placement="bottom"
        arrowStyle={styles.arrow}
        backgroundStyle={styles.background}
      >
        {this.props.menus.map((result, i, arr) => {
          return (
            <TouchableOpacity
              key={i}
              underlayColor="transparent"
              onPress={() => this.onMoreMenuSelect(arr[i])}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '400',
                  padding: 6,
                  textAlign: 'center',
                }}
              >
                {arr[i]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Popover>
    );
    return view;
  }

  render() {
    return this.renderMoreView();
  }
}
