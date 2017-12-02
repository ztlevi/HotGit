import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import NavigatorBar from './NavigatorBar'

export default class Girl extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  renderButton(image) {
    return <TouchableOpacity
              onPress={()=>{
                 this.props.navigation.goBack();
             }}
           >
      <Image style={{width:22, height:22, margin:5}} source={image}></Image>
    </TouchableOpacity>
  }

  render() {
    const {
      navigate,
      state,
      goBack
    } = this.props.navigation;

    return (
      <View style={styles.container}>
        <NavigatorBar
          title={"Girl"}
          style={{
            backgroundColor: '#EE6363'
          }}
          leftButton={
            this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))
          }
          rightButton={
            this.renderButton(require('./res/images/ic_star.png'))
          }
        />
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
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22
  }
})
