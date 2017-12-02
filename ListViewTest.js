import React, {
  Component
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ListView,
  Button,
  RefreshControl,
} from 'react-native'
import NavigatorBar from './NavigatorBar'
import Toast, {DURATION} from 'react-native-easy-toast'

var data = {
  "result": [{
    "email": "l.yzfeqoyel@vyktre.nt",
    "fullName": "张三张三张三"
  },
    {
      "email": "r.imkrs@sxdhieb.cz",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "c.lgjvtcskax@oyff.la",
      "fullName": "张三张三张三"
    },
    {
      "email": "r.unjxsss@fxkpxbvhi.info",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "o.lfwf@ekpyc.bd",
      "fullName": "张三张三"
    },
    {
      "email": "t.gvudin@xcki.gov.cn",
      "fullName": "张三张三张三张三张三"
    },
    {
      "email": "i.letmotsgn@oslxthy.qa",
      "fullName": "张三张三张三"
    },
    {
      "email": "j.xrwffh@rano.bt",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "h.tmigrezqq@byvrxsmjt.ky",
      "fullName": "张三张三"
    },
    {
      "email": "g.rickgemyjw@yiffhwc.gov.cn",
      "fullName": "张三张三张三"
    },
    {
      "email": "c.wsnp@wnfbqlom.tw",
      "fullName": "张三张三张三"
    },
    {
      "email": "h.gccy@fcbdhsr.lk",
      "fullName": "张三张三张三张三张三"
    },
    {
      "email": "e.lxrdeh@vomjcd.ag",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "p.kgrt@ysaqj.tm",
      "fullName": "张三张三张三"
    },
    {
      "email": "x.ugdwli@rnfnyy.se",
      "fullName": "张三张三张三张三"
    }
  ]
}

export default class ListViewTest extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(data.result),
      isLoading: true,
    }
    this.onLoad();
  }

  renderRow(item) {
    return <View style={styles.row}>
      <TouchableOpacity
        onPress={() => {
          this.toast.show('You clicked:' + item.fullName, DURATION.LENGTH_LONG)
        }}>
        <Text style={styles.tips}>{item.fullName}</Text>
        <Text style={styles.tips}>{item.email}</Text>
      </TouchableOpacity>
    </View>
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <View key={rowID} style={styles.line}></View>
  }

  renderFooter() {
    return <Image style={{width: 400, height: 400}}
                  source={{uri: 'https://media.giphy.com/media/3oEdva9BUHPIs2SkGk/giphy.gif'}}/>
  }

  onLoad() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000);

  }

  render() {
    return (
      <View style={styles.container}>
        <NavigatorBar
          title='ListViewTest'
          statusBar={{backgroundColor:'red'}}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(item) => this.renderRow(item)}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
          renderFooter={() => this.renderFooter()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              nRefresh={() => this.onLoad()}
            />
          }
        />
        <Toast ref={toast => {
          this.toast = toast
        }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tips: {
    fontSize: 18,
  },
  row: {
    height: 50
  },
  line: {
    height: 1,
    backgroundColor: 'black'
  },
  text: {
    fontSize: 20,
  }
})
