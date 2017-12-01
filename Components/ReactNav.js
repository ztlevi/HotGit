import React, {
  Component
} from 'react';
import {
  View,
  Button,
  StyleSheet,
} from 'react-native';

export default class ReactNav extends Component {
  render() {
    const {navigate} = this.props.navigation; //使用这种引入方式更加简单
    return (
      <View style={styles.container}>
        <Button
          title="跳转到第二个页面"
          //navigate('NavThird') 不带参数直接push
          //navigate('NavThird',{passTitle:'由第二传值到第三'})带参数push,且同样格式可带多个
          //navigate('NavThird',{passTitle:'由第二传值到第三'，callBack:(data)=>{}})生明可回调的函数，data为回调的数据
          onPress={() => navigate('NavSec', {
              user: '第一界面传真到第二显示', callBack: (backData) => {
                alert(backData)
              }
            }
          )}
        />
      </View>
    );
  }

  static  navigationOptions = {
    title: '标题1'
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});