import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

export default class Girl extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const  {navigate,state,goBack} = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>I am Girl.</Text>
        <Text style={styles.text}>我收到了男孩送的:{state.params.word}</Text>
        <Text style={styles.text}
              onPress={() => {
                state.params.callBack('一盒巧克力')
                goBack()
              }}>
        回赠巧克力
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center'
  },
  text: {
    fontSize: 22
  }
})
