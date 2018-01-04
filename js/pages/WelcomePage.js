import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import GlobalStyles from '../../res/styles/GlobalStyles';
import { Avatar } from 'react-native-elements';
import ThemeDAO from '../expand/dao/ThemeDAO';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
    let title = <Text style={GlobalStyles.titleText}>Welcome Page</Text>;
    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(title)}
        <Avatar
          large
          rounded
          icon={{ name: 'whatshot' }}
          onPress={() => console.log('Works!')}
          activeOpacity={0.7}
          containerStyle={{
            flex: 1,
            alignItems: 'center',
            height: 50,
            marginRight: 60,
          }}
        />
      </View>
    );
  }
}
