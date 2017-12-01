import React, {
  Component
} from 'react';
import {
  View,
  Button,
  StyleSheet,
} from 'react-native';

export default class ReactThiNav extends Component {
  render() {
    const  {navigate,goBack,state} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Button
          title={state.params.passTitle}
          onPress={()=>{goBack()}}
          color="white"
        />
      </View>
    );
  }
  static  navigationOptions = {
      title: '标题3'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
});