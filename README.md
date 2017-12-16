# Github Treading App powered by React Native

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Intsall

install with `yarn` and then `yarn start`. Scan the QR code to install the Expo app and run the app on your iPhone.

## Detail
For the favorite page, there is some delay for Github API. That's why I put 2 min for fetching remote starred repos. And keep fetching remote starred repos cost a lot of network traffic. Anyway, you are not able to see your new stars instantly.
## Screen shots

There is a basic *Popular Page* screenshot.

<img src="./screenshots/popular_page.jpg" alt="popular page" style="width:200px;margin:auto;display:block;"/>

> Notes:
  Current react-natiev-modal-popover version has issue with Android. See details here https://github.com/doomsower/react-native-modal-popover/pull/10 .
  I manually fix this in node_modules by changing `useNativeDriver: Platform.OS === 'ios'`
