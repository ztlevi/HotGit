import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native'
import NavigatorBar from './NavigatorBar'

export default class Boy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      what: ''
    }
  }

  render() {
    const {
      navigate
    } = this.props.navigation;
    let what = this.state.what === '' ? '' : '我收到了女孩回赠的' + this.state.what;
    return (
      <View style={styles.container}>
        <NavigatorBar
          title={'Boy'}
          statusBar={{
            backgroundColor:'#EE6363'
          }}
        />
        <Text style={styles.text}>I am boy</Text>
        <Text style={styles.text}
              title="Boy"
              onPress={() => navigate('GirlPage',
                {
                  what: '一只玫瑰',
                  callBack: (what) => {
                    this.setState({
                      what: what
                    })
                  }
                })
              }
        >送女孩一只玫瑰</Text>
        <Text style={styles.text}>{this.state.what}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 20,
  }
})
