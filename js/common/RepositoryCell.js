import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import {Icon} from 'react-native-elements'

export default class RepositoryCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: this.props.projectModel.isFavorite ? 'star'
        : 'star-border'
    }
  }

  onPressFavorite () {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    this.props.projectModel.isFavorite = !this.props.projectModel.isFavorite
  }

  setFavoriteState (isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? 'star' : 'star-border'
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setFavoriteState(nextProps.projectModel.isFavorite)
  }

  // with callback function, to re-render the star icon when finish
  onSelect () {
    let projectModel = this.props.projectModel
    const {navigate} = this.props.navigation
    navigate('repositoryDetailPage', {
      projectModel: projectModel,
      callback: (isFavorite) => this.setFavoriteState(isFavorite)
    })
  }

  getDescription (item) {
    let text = item.description
    if (text && text.length > 200) {
      text = text.substring(0, 200) + '...'
    }
    return text
  }

  render () {
    let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel
    let favoriteButton = <TouchableOpacity
      onPress={() => this.onPressFavorite()}
    >
      <Icon
        name={this.state.favoriteIcon}
        color='#2196F3'
        style={{width: 22, height: 22}}
      />
    </TouchableOpacity>

    return (
      <TouchableOpacity
        onPress={() => this.onSelect()}
        style={styles.container}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.description}>{this.getDescription(item)}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Author: </Text>
              <Image
                style={{height: 22, width: 22}}
                source={{uri: item.owner.avatar_url}}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Star: </Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {favoriteButton}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
    borderRadius: 2
  },
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    borderRadius:3,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  }
})