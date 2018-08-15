import * as React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {persistStore} from 'redux-persist'
import * as Web3 from 'web3'
import App from './App'
import {Ethereum} from './Ethereum'
import './index.css'
import store from './redux/store'

interface IPersistGateState {
  account?: string | null
  rehydrating: boolean
  networkName?: string
  ethereum?: Ethereum
}

declare global {
  /* tslint:disable:interface-name */
  interface Window {
    web3?: Web3
  }
}

const Loading = () => <div>Loading</div>

const MetamaskLocked = () => <div>Please unlock Metamask</div>

class PersistGate extends React.Component<{}, IPersistGateState> {
  public state: IPersistGateState = {
    account: undefined,
    ethereum: undefined,
    networkName: undefined,
    rehydrating: false,
  }

  public async componentWillMount() {
    const web3 = window.web3
    if (web3 !== undefined) {
      const ethereum = new Ethereum(web3)
      this.setState(() => ({ethereum}))
      ethereum.firstAccount().then(account => this.setState(() => ({account})))
    }
    // this.ethereumInterval = global.setInterval(this.pollForEthChange, 1000)
    persistStore(store, {blacklist: []}, () => {
      this.setState(() => ({rehydrating: false}))
    })
  }

  public render() {
    if (this.state.rehydrating) {
      return <Loading />
    }
    if (!this.state.ethereum || !this.state.ethereum.isMetamaskActive()) {
      return <div>Please install Metamask</div>
    }
    if (this.state.account === undefined) {
      console.warn('Metamask should not be open without an account open')
      return <Loading />
    }

    if (this.state.account === null) {
      return <MetamaskLocked />
    }
    return (
      <Provider store={store}>
        <div>
          <div>signed in as: {this.state.account}</div>
          <pre>
            {this.state.ethereum &&
              JSON.stringify(this.state.ethereum.currentNetwork(), null, 2)}
          </pre>
          <App />
          {/* <Pages
            ethereum={this.web3!}
            rehydrating={this.state.rehydrating}
          /> */}
        </div>
      </Provider>
    )
  }
}

const target = document.querySelector('#root')
render(<PersistGate />, target)
