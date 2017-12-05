import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  TextInput,
} from 'react-native'

import ComponentWithNavigationBar from './js/common/NavigatorBar'
import Toast, { DURATION } from 'react-native-easy-toast'

const KEY = 'text'

export default class AsyncStorageTest extends Component {
  onSave () {
    AsyncStorage.setItem(KEY, this.text, (error) => {
      if (!error) {
        this.toast.show('Save successfully', DURATION.LENGTH_LONG)
      } else {
        this.toast.show('Save failed', DURATION.LENGTH_LONG)
      }
    })
  }

  onFetch () {
    AsyncStorage.getItem(KEY, (error, result) => {
      if (!error) {
        if (result !== null && result !== '') {
          this.toast.show('Get item ' + result)
        } else {
          this.toast.show('The item does not exist')
        }
      } else {
        this.toast.show('Get failed')
      }
    })
  }

  onRemove () {
    AsyncStorage.removeItem(KEY, (error) => {
      if (!error) {
        this.toast.show('Delete successfully', DURATION.LENGTH_LONG)
      } else {
        this.toast.show('Delete failed', DURATION.LENGTH_LONG)
      }
    })
  }

  render () {
    return (
      <View sytle={styles.container}>
        {ComponentWithNavigationBar({title:'Async Storage Usage'})}
        <TextInput
          style={{borderWidth: 1, height: 40, margin: 6}}
          onChangeText={text => this.text = text}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.tips}
                onPress={() => this.onSave()
                }>Save</Text>
          <Text style={styles.tips}
                onPress={() => this.onRemove()
                }>Delete</Text>
          <Text style={styles.tips}
                onPress={() => this.onFetch()
                }>Get</Text>
        </View>
        <Toast ref={toast => this.toast = toast}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29,
    margin: 5,
  }
})
