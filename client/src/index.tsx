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
import {Ethereum} from './Ethereum'
import store from './redux/store'

interface IPersistGateState {
  rehydrating: boolean
  ethereum?: Ethereum
}

declare global {
  /* tslint:disable:interface-name */
  interface Window {
    web3: any
  }
}

const Loading = () => <div>Loading</div>

class PersistGate extends React.Component<{}, IPersistGateState> {
  public state: IPersistGateState = {rehydrating: true}

  public componentDidMount() {
    const newEthereum = new Ethereum(window.web3)
    this.setState(() => ({ethereum: newEthereum}))
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
      if (!this.state.ethereum) {
        return <Loading />
      }
    }

    return (
      <Provider store={store}>
        <div>
          <pre>
            {this.state.ethereum &&
              JSON.stringify(this.state.ethereum.currentNetwork(), null, 2)}
          </pre>
          <pre>Hi!</pre>
          {/* <Pages
            ethereum={this.state.ethereum!}
            rehydrating={this.state.rehydrating}
          /> */}
        </div>
      </Provider>
    )
  }
}

const target = document.querySelector('#root')
render(<PersistGate />, target)
