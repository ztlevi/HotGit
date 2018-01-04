import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import ComponentWithNavigationBar from '../../common/NavigatorBar';
import LanguageDAO, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDAO';
import ArrayUtils from '../../util/ArrayUtils';
import SortableListView from 'react-native-sortable-listview';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import { Icon } from 'react-native-elements';
import { ACTION_HOME, FLAG_TAB } from '../HomePage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29,
  },
  item: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    this.dataArray = [];
    this.sortResultArray = [];
    this.originalCheckedArray = [];
    this.state = {
      checkedArray: [],
    };
  }

  componentDidMount() {
    const { state } = this.props.navigation;
    this.flag = state.params.flag;
    this.languageDAO = new LanguageDAO(this.flag);
    this.loadData();
  }

  loadData() {
    this.languageDAO
      .fetch()
      .then(result => {
        this.getCheckedItems(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCheckedItems(result) {
    this.dataArray = result;
    let checkedArray = [];
    for (let i = 0, len = result.length; i < len; i++) {
      let data = result[i];
      if (data.checked) checkedArray.push(data);
    }
    this.setState({
      checkedArray: checkedArray,
    });
    this.originalCheckedArray = ArrayUtils.clone(checkedArray);
  }

  onBack() {
    if (
      ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)
    ) {
      this.props.navigation.goBack();
      return;
    }
    Alert.alert(
      'Note',
      'Do you want to save modification?',
      [
        { text: 'NO', onPress: () => this.props.navigation.goBack() },
        { text: 'YES', onPress: () => this.onSave(true) },
      ],
      { cancelable: false }
    );
  }

  onSave(idChecked) {
    if (
      !idChecked &&
      ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)
    ) {
      this.props.navigation.goBack();
      return;
    }
    this.getSortResult();
    this.languageDAO.save(this.sortResultArray);

    const { state } = this.props.navigation;

    let jumpToTab =
      state.params.flag === FLAG_LANGUAGE.flag_key
        ? FLAG_TAB.flag_popularTab
        : FLAG_TAB.flag_trendingTab;
    DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, {
      jumpToTab: jumpToTab,
    });
  }

  getSortResult() {
    this.sortResultArray = ArrayUtils.clone(this.dataArray);
    for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
      let item = this.originalCheckedArray[i];
      let index = this.dataArray.indexOf(item);
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
  }

  render() {
    let order = Object.keys(this.state.checkedArray);

    let leftButton = ViewUtils.getLeftButton(() => this.onBack());
    let rightButton = ViewUtils.getRightButton(() => this.onBack(), 'Save');

    let title =
      this.flag === FLAG_LANGUAGE.flag_language ? 'Sort Language' : 'Sort Key';
    let titleText = <Text style={GlobalStyles.titleText}>{title}</Text>;

    return (
      <View style={styles.container}>
        {ComponentWithNavigationBar(
          titleText,
          leftButton,
          rightButton,
          this.props.theme.themeColor
        )}
        <SortableListView
          data={this.state.checkedArray}
          order={order}
          onRowMoved={e => {
            this.state.checkedArray.splice(
              e.to,
              0,
              this.state.checkedArray.splice(e.from, 1)[0]
            );
            this.forceUpdate();
          }}
          renderRow={row => (
            <SortCell data={row} color={this.props.theme.themeColor} />
          )}
        />
      </View>
    );
  }
}

class SortCell extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        delayLongPress={500}
        style={styles.item}
        {...this.props.sortHandlers}
      >
        <View style={styles.row}>
          <Icon
            name="reorder"
            size={16}
            color={this.props.color}
            containerStyle={{ marginRight: 10 }}
          />
          <Text style={{ fontWeight: 'bold' }}>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
