import { View, Platform, StyleSheet, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { startLoadTheme } from '../actions/theme';
import ComponentWithNavigationBar from '../common/NavigatorBar';
import GlobalStyles from '../../res/styles/GlobalStyles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class WelcomePage extends Component {
  componentDidMount() {
    // new ThemeDAO().getTheme().then(data => {
    //   this.theme = data;
    // });
    const { navigate } = this.props.navigation;
    this.props.startLoadTheme();
    setTimeout(() => {
      navigate('homePage', { theme: this.props.theme });
    }, 1000);
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

const mapStateToProps = state => ({
  theme: state.theme.theme,
});
const mapDispatchToProps = dispatch => ({
  startLoadTheme: () => dispatch(startLoadTheme()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomePage);
