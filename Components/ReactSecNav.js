import React, {
  Component
} from 'react';
import {
  View,
  Button,
  StyleSheet,
} from 'react-native';


export default class ReactNavSec extends Component {
  back =(state,goBack)=>{ //把属性传递过来，然后进行使用
    state.params.callBack('this is back data ') //回调传值
    goBack() //点击POP上一个页面得方法
  }
  render() {
    const  {navigate,state,goBack,} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Button
          title={state.params.user} //取得正向传值
          onPress={()=>this.back(state,goBack)}
        />
        <Button
          title={state.params.user} //取得正向传值
          onPress={()=>navigate('NavThird',{passTitle:'由第二传值到第三'})}
        />
      </View>
    );
  }
  static  navigationOptions = {
    title: '标题2'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
});