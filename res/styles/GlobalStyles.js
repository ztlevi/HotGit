/**
 * Global Styles
 */
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
module.exports = {
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#dcdcdc',
  },
  root_container: {
    flex: 1,
    backgroundColor: '#f3f3f4',
  },
  titleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '400',
    marginBottom: 2.5,
  },
  backgroundColor: '#f3f3f4',
  nav_bar_height_ios: 44,
  nav_bar_height_android: 50,
  window_height: height,
  window_width: width,
};
