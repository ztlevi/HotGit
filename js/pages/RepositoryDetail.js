import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import ViewUtils from '../util/ViewUtils';
import FavoriteDAO from '../expand/dao/FavoriteDAO';
import { Icon } from 'react-native-elements';
import GlobalStyles from '../../res/styles/GlobalStyles';

favoriteDAO = new FavoriteDAO();

const TRENDING_URL = 'https://github.com/';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    margin: 2,
  },
});

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.navigation;
    this.projectModel = state.params.projectModel;
    let item = state.params.projectModel.item;
    this.url = item.html_url ? item.html_url : TRENDING_URL + item.fullName;
    let title = item.full_name ? item.full_name : item.fullName;
    this.state = {
      url: this.url,
      title: title,
      canGoBack: false,
      isFavorite: this.projectModel.isFavorite,
    };
  }

  goBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
      // set callback function to re-render the icon status when go back
      this.props.navigation.state.params.callback(this.state.isFavorite);
    }
  }

  go() {
    this.setState({
      url: this.text,
    });
  }

  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url,
    });
  }

  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
    });
  }

  onRightButtonClick() {
    let projectModel = this.projectModel;
    let item = projectModel.item;
    this.setFavoriteState((projectModel.isFavorite = !projectModel.isFavorite));
    let key = item.fullName ? item.fullName : item.full_name;

    if (projectModel.isFavorite) {
      favoriteDAO.saveFavoriteItem('id_' + key, JSON.stringify(item));
    } else {
      favoriteDAO.removeFavoriteItem('id_' + key, JSON.stringify(item));
    }
  }

  render() {
    let leftButton = ViewUtils.getLeftButton(() => this.goBack());

    // let rightButtonImage = <Image
    //   style={{width: 20, height: 20, marginRight: 10}}
    //   source={this.state.favoriteIcon}
    // />
    let rightButtonIcon = (
      <Icon
        name="star"
        color={this.state.isFavorite ? 'orange' : 'white'}
        style={{ width: 26, height: 26 }}
      />
    );
    let rightButton = ViewUtils.getRightButtonImage(
      () => this.onRightButtonClick(),
      rightButtonIcon
    );
    let titleWidth = 22;
    let titleShrinked =
      this.state.title.length > titleWidth
        ? this.state.title.substring(0, titleWidth) + '...'
        : this.state.title;
    let title = <Text style={GlobalStyles.titleText}>{titleShrinked}</Text>;
    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(title, leftButton, rightButton)}
        <WebView
          ref={webView => (this.webView = webView)}
          source={{ uri: this.state.url }}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    );
  }
}
