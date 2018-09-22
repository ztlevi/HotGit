import { Icon } from 'react-native-elements';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import React from 'react';

import { FLAG_LANGUAGE } from '../../expand/dao/LanguageDAO';
import { MORE_MENU } from '../../common/MoreMenu';
import BaseComponent from '../BaseComponent';
import ComponentWithNavigationBar from '../../common/NavigatorBar';
import CustomThemePage from './CustomTheme';
import FavoriteDAO from '../../expand/dao/FavoriteDAO';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import UserDAO from '../../expand/dao/UserDAO';
import ViewUtils from '../../util/ViewUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60,
    backgroundColor: 'white',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },
});

export default class MyPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.favoriteDAO = new FavoriteDAO();
    this.userDAO = new UserDAO();
    this.state = {
      user: null,
      avatar_url: null,
      customThemeViewVisible: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadUser();
  }

  loadUser() {
    this.userDAO.loadCurrentUser().then(result => {
      this.setState({
        user: result,
      });
    });
    this.userDAO.loadUserAvatar().then(result => {
      this.setState({
        user_avatar: result,
      });
    });
  }

  logoutUser() {
    this.setState({
      user: null,
      user_avatar: null,
    });
  }

  renderCustomThemeView() {
    return (
      <CustomThemePage
        visible={this.state.customThemeViewVisible}
        {...this.props}
        onClose={() =>
          this.setState({
            customThemeViewVisible: false,
          })
        }
      />
    );
  }

  onClick(tab) {
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
        this.setState({ customThemeViewVisible: true });
        break;
      case MORE_MENU.About_Author:
        TargetComponent = 'aboutMePage';
        break;
      case MORE_MENU.About:
        TargetComponent = 'aboutPage';
        break;
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, {
        ...params,
        theme: this.props.theme,
      });
    }
  }

  getItem(tag, icon, text) {
    return ViewUtils.getSettingItem(
      () => this.onClick(tag),
      icon,
      text,
      this.props.theme.themeColor,
      null
    );
  }

  render() {
    let title = <Text style={GlobalStyles.titleText}>My Account</Text>;

    return (
      <View style={GlobalStyles.root_container}>
        {ComponentWithNavigationBar(
          title,
          null,
          null,
          this.props.theme.themeColor
        )}
        <ScrollView>
          <TouchableHighlight onPress={() => this.onClick(MORE_MENU.Login)}>
            <View style={[styles.row, { height: 90 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="account-circle"
                  size={40}
                  color={this.props.theme.themeColor}
                  containerStyle={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 20 }}>
                  {this.state.user ? this.state.user : 'Account Login'}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-right"
                size={22}
                containerStyle={{ marginRight: 10 }}
                color={this.props.theme.themeColor}
              />
            </View>
          </TouchableHighlight>
          <View style={GlobalStyles.line} />

          {/*Trending Key setting*/}
          <Text style={styles.groupTitle}>Popular tab key setting</Text>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Custom_Key, 'list', 'Custom Key')}
          <View style={GlobalStyles.line} />
          {/*Key Sort*/}
          {this.getItem(MORE_MENU.Sort_Key, 'sort', 'Sort Key')}
          <View style={GlobalStyles.line} />
          {/*Key remove*/}
          {/* {this.getItem(MORE_MENU.Remove_Key, 'remove', 'Remove Key')} */}
          {/* <View style={GlobalStyles.line} /> */}

          {/*Popular setting*/}
          <Text style={styles.groupTitle}>Trending tab language setting</Text>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Custom_Language, 'list', 'Custom Language')}
          <View style={GlobalStyles.line} />
          {/*Languate Sort*/}
          {this.getItem(MORE_MENU.Sort_Language, 'sort', 'Sort Language')}
          <View style={GlobalStyles.line} />

          {/*More setting*/}
          <Text style={styles.groupTitle}>More</Text>
          <View style={GlobalStyles.line} />
          {/*custom theme*/}
          {this.getItem(MORE_MENU.Custom_Theme, 'palette', 'Custom Theme')}
          <View style={GlobalStyles.line} />
          {/*About Author*/}
          {this.getItem(MORE_MENU.About, 'dashboard', 'About')}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author, 'mood', 'About Author')}
          <View style={GlobalStyles.line} />
        </ScrollView>
        {this.renderCustomThemeView()}
      </View>
    );
  }
}
