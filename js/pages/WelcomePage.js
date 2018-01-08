import React, { Component } from 'react';
import { View, Platform, StyleSheet, Text, Image } from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ThemeDAO from '../expand/dao/ThemeDAO';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class WelcomePage extends Component {
  componentDidMount() {
    new ThemeDAO().getTheme().then(data => {
      this.theme = data;
    });
    const { navigate } = this.props.navigation;
    setTimeout(() => {
      navigate('homePage', { theme: this.theme });
    }, 500);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 364, height: 200 }}
          source={require('../../res/images/welcome.png')}
        />
        <Text style={{ fontSize: 18 }}>Welcome to Trending Github</Text>
      </View>
    );
  }
}
