// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';

// ReactDOM.render(
//   <App />,
//   document.getElementById('root') as HTMLElement
// );

// import Loading from '@client/components/Loading'
import * as React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {persistStore} from 'redux-persist'
import * as Web3 from 'web3'
// // import {Ethereum} from './Ethereum'
import store from './redux/store'

interface IPersistGateState {
  rehydrating: boolean
  // // ethereum?: Ethereum
}

declare global {
  /* tslint:disable:interface-name */
  interface Window {
    web3: Web3
  }
}

const Loading = () => <div>Loading</div>

class PersistGate extends React.Component<{}, IPersistGateState> {
  public state: IPersistGateState = {rehydrating: true}

  public componentDidMount() {
    console.log({
      currentProvider: window.web3.currentProvider,
      'currentProvider.isMetaMask': window.web3.currentProvider.isMetaMask,
      'eth.accounts': window.web3.eth.accounts,
      net: window.web3.net,
    })
    console.log(window.web3.personal && window.web3)
    // let web3 = new Web3(
    //   new Web3.providers.HttpProvider(
    //     // (Web3 as any).givenProvider
    //     // 'https://mainnet.infura.io/FE44zGZoLEQTXSTJ1XmS'
    //   )
    // )
    // // 'https://mainnet.infura.io/FE44zGZoLEQTXSTJ1XmS'
    // // const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    // console.log(web3)
    // console.log(web3.version.network)
    // console.log(web3.version)
    // console.log(web3.currentProvider.isMetaMask)
    // console.log(web3.currentProvider)
    // console.log(web3.net)
    // console.log(web3.eth.accounts[0])
    // if (typeof web3 !== 'undefined') {
    //   console.log('Using web3 detected from external source like Metamask')
    //   web3 = new Web3(web3.currentProvider)
    // } else {
    //   web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    // }

    // web3.eth.getAccounts((err, accounts) => {
    //   console.log(accounts)
    //   console.log(JSON.stringify(accounts))
    // })

    // console.log(web3.eth.getBalance(web3.eth.accounts[0]).toNumber())

    // const newEthereum = new Ethereum(window.web3)
    // // this.setState(() => ({ethereum: newEthereum}))
    persistStore(store, {blacklist: []}, () => {
      this.setState(() => ({rehydrating: false}))
    })
  }

  public render() {
    // Only wait for loading to happen on app pages
    if (window.location.pathname.startsWith('/app')) {
      if (this.state.rehydrating) {
        return <Loading />
      }
      // if (!this.state.ethereum) {
      // return <Loading />
      // }
    }

    return (
      <Provider store={store}>
        <div>
          {/* <pre>
            {this.state.ethereum &&
              JSON.stringify(this.state.ethereum.currentNetwork(), null, 2)}
          </pre> */}
          <pre>Hi!</pre>
          {/* <Pages
            // // ethereum={this.state.ethereum!}
            rehydrating={this.state.rehydrating}
          /> */}
        </div>
      </Provider>
    )
  }
}

const target = document.querySelector('#root')
render(<PersistGate />, target)
