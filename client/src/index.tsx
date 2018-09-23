import * as React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import {persistStore} from 'redux-persist'
import * as Web3 from 'web3'
import App from './App'
import Navbar from './components/Navbar'
import {Setup} from './components/Setup'
import {Ethereum} from './Ethereum'
import store from './redux/store'

import {clearUser} from './api'
import './index.css'

declare global {
  /* tslint:disable-next-line:interface-name */
  interface Window {
    web3?: Web3
  }
}

interface IPersistGateState {
  rehydrating: boolean
  ethereum?: Ethereum
}

const Loading = () => <div>Loading</div>

const Archive = (props: {address: string; firstName: string}) => {
  const clearStorage = () => clearUser(props.address)
  return (
    <>
      <Navbar {...props} clearStorage={clearStorage} />
      <code>TODO</code>
    </>
  )
}

class PersistGate extends React.Component<{}, IPersistGateState> {
  public state: IPersistGateState = {rehydrating: true}

  private ethereumInterval: NodeJS.Timer

  public componentDidMount() {
    this.ethereumInterval = global.setInterval(this.pollForEthChange, 1000)
    persistStore(store, {blacklist: []}, () => {
      this.setState(() => ({rehydrating: false}))
    })
  }

  public componentWillUnmount() {
    if (this.ethereumInterval) {
      global.clearInterval(this.ethereumInterval)
    }
  }

  public render() {
    if (this.state.rehydrating || !this.state.ethereum) {
      return <Loading />
    }

    return (
      <Provider store={store}>
        <Setup ethereum={this.state.ethereum} header="Sign In">
          {setupProps => {
            const clearStorage = () => clearUser(setupProps.ethAddress)
            return (
              <BrowserRouter>
                <div className="container">
                  <Navbar
                    {...this.props}
                    clearStorage={clearStorage}
                    address={setupProps.ethAddress}
                    firstName="Bowser"
                  />
                  <Route
                    exact
                    path="/"
                    component={() => (
                      /* tslint:disable-next-line */
                      <App firstName="Bowser" address={setupProps.ethAddress} />
                    )}
                  />
                  <Route
                    exact
                    path="/archive"
                    component={() => (
                      /* tslint:disable-next-line */
                      <Archive firstName="Bowser" address={setupProps.ethAddress} />
                    )}
                  />
                </div>
              </BrowserRouter>
            )
          }}
        </Setup>
      </Provider>
    )
  }

  private pollForEthChange = () => {
    const newEthereum = new Ethereum(window.web3)
    const currentEthereum = this.state.ethereum

    if (
      !currentEthereum ||
      newEthereum.currentNetwork() !== currentEthereum.currentNetwork()
    ) {
      this.setState(() => ({ethereum: newEthereum}))
      this.forceUpdate()
    }
  }
}

const target = document.querySelector('#root')
render(<PersistGate />, target)
