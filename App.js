import { StyleSheet } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import React from 'react';
import createSagaMiddleware from 'redux-saga';

import { Provider } from 'react-redux';

import Root from './js/pages/setup';
import rootReducer from './js/reducers';
import rootSaga from './js/sagas';

const sagaMiddleware = createSagaMiddleware();
// Logger with default options
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
