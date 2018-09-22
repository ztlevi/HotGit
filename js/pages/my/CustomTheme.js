import {
  View,
  TouchableHighlight,
  Modal,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { ThemeFlags } from '../../../res/styles/ThemeFactory';
import { onChangeTheme } from '../../actions/theme';
import GlobalStyles from '../../../res/styles/GlobalStyles';

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    margin: 10,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3,
  },
  modal: {
    /* alignItems: 'center',
     * justifyContent: 'center',
     * opacity: 0.9,*/
    height: 100,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 105,
    right: 10,
    /* borderRadius: 3,*/
  },
});

class CustomTheme extends Component {
  constructor(props) {
    super(props);
  }

  onSelectTheme(themeKey) {
    this.props.onClose();
    this.props.onChangeTheme(ThemeFlags[themeKey]);
  }
  /**
   * Create Theme item
   * @param themeKey
   */
  getThemeItem(themeKey) {
    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        underlayColor="white"
        onPress={() => this.onSelectTheme(themeKey)}
      >
        <View
          style={[{ backgroundColor: ThemeFlags[themeKey] }, styles.themeItem]}
        >
          <Text style={styles.themeText}>{themeKey}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Create Theme list
   */
  renderThemeItems() {
    let views = [];
    for (
      let i = 0, keys = Object.keys(ThemeFlags), l = keys.length;
      i < l;
      i = i + 3
    ) {
      let key1 = keys[i],
        key2 = keys[i + 1],
        key3 = keys[i + 2];
      views.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          {this.getThemeItem(key1)}
          {this.getThemeItem(key2)}
          {this.getThemeItem(key3)}
        </View>
      );
    }
    return views;
  }

  renderContainerView() {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose();
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView>{this.renderThemeItems()}</ScrollView>
        </View>
      </Modal>
    );
  }
  render() {
    let view = this.props.visible ? (
      <View style={GlobalStyles.root_container}>
        {this.renderContainerView()}
      </View>
    ) : null;
    return view;
  }
}

const mapDispatchToProps = dispatch => ({
  onChangeTheme: themeFlag => {
    dispatch(onChangeTheme(themeFlag));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(CustomTheme);
