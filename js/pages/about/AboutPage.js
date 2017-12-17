import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtils from '../../util/ViewUtils'
import { MORE_MENU } from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'

export default class AboutPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  onClick (tab) {
    let TargetComponent, params = {...this.props, menuType: tab}
    switch (tab) {
      case MORE_MENU.About_Author:
        break
      case MORE_MENU.WebSite:
        break
      case MORE_MENU.Remove_Key:
        break
    }

    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, {...params})
    }
  }

  getParallaxScrollRenderConfig (params) {
    let config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image
          style={{width: window.width, height: PARALLAX_HEADER_HEIGHT}}
          source={params.backgroundImg}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT
        }}/>
      </View>
    )
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={[styles.avatar, {width: AVATAR_SIZE, height: AVATAR_SIZE}]}
               source={params.avatar}/>
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    )

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => this.props.navigation.goBack())}
      </View>
    )

    return config
  }

  renderView (contentView, params) {
    let renderConfig = this.getParallaxScrollRenderConfig(params)
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor="#2196F3"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}
      >
        {contentView}
      </ParallaxScrollView>
    )
  }

  render () {
    let content = <View>
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.WebSite), require('../../../res/images/ic_computer.png'), MORE_MENU.WebSite, {tintColor:'#2196F3'})}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.About_Author), require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author, {tintColor:'#2196F3'})}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, {tintColor:'#2196F3'})}
    </View>
    return this.renderView(content, {
      'name': 'Github Popular',
      'description': 'This is a Github Mobile App built with React Native. This app aims to help developers keep tracking on Github\'s popular repositories.',
      'avatar': require('../../../res/avatar/author.jpg'),
      'backgroundImg': require('../../../res/avatar/background.jpg')
    })
  }
}

const window = Dimensions.get('window')

const AVATAR_SIZE = 120
const ROW_HEIGHT = 60
const PARALLAX_HEADER_HEIGHT = 350
const STICKY_HEADER_HEIGHT = 70

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 0,
    top: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    justifyContent: 'space-between',
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    padding:8,
    textAlign:'center',
    color: 'white',
    fontSize: 15,
    paddingVertical: 5
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  rowText: {
    fontSize: 20
  }
})
