# Github Treading App powered by React Native

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Intsall

install with `yarn` and then `yarn start`. Scan the QR code to install the Expo app and run the app on your iPhone.

> Notes:
> Current react-natiev-modal-popover version has issue with Android. See details here https://github.com/doomsower/react-native-modal-popover/pull/10 .
> I manually fix this in node_modules by changing `useNativeDriver: Platform.OS === 'ios'`

## Detail

For the favorite page, there is some delay for Github API. That's why I put 2 min for fetching remote starred repos. And keep fetching remote starred repos cost a lot of network traffic. Anyway, you are not able to see your new stars instantly.

## Screen shots

![screenshots](./screenshots/screenshots.png)

## TODO

1. Coverage
2. Eslint
3. Travis
