import createHistory from 'history/createBrowserHistory'
import {routerMiddleware} from 'react-router-redux'
import {applyMiddleware, compose, createStore} from 'redux'
import {autoRehydrate} from 'redux-persist'

import rootReducer from './reducers'

export const history = createHistory()

const enhancers: Array<() => void> = []
const middleware = [routerMiddleware(history)]

declare global {
  /* tslint:disable:interface-name */
  interface Window {
    devToolsExtension: () => () => void
  }
}

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  autoRehydrate(),
  ...enhancers
)

const store = createStore(rootReducer, composedEnhancers)

export default store
