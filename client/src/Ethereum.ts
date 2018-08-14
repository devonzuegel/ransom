import {get} from 'lodash'
import * as Web3 from 'web3'
/* tslint:disable:no-var-requires */
// const ProviderEngine = require('web3-provider-engine')
// const Web3Subprovider = require('web3-provider-engine/subproviders/web3')

class Ethereum {
  private web3: Web3

  constructor(private injectedWeb3: Web3) {
    // const engine = new ProviderEngine()
    // // only need custom engine to get tx callback
    // // engine.addProvider(new SendTransactionHookProvider(1, createPendingTx))
    // // engine.addProvider(new FiltersSubprovider())
    // engine.addProvider(new Web3Subprovider(injectedWeb3.currentProvider))
    // engine.start()
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }
  public isMetamaskActive = () =>
    get(this.injectedWeb3, 'currentProvider.isMetaMask') === true

  public currentNetwork = () => {
    // console.log(this.injectedWeb3)
    // console.log(this.injectedWeb3.version.getNetwork)
    // console.log(this.injectedWeb3.version.network)
    // console.log('getNetwork():', this.injectedWeb3.version.getNetwork(console))
    // console.log(get(this.injectedWeb3, 'version'))
    // console.log(get(this.injectedWeb3, 'version.network'))
    // const networkId = get(this.injectedWeb3, 'version.network')
    // console.log(this.injectedWeb3.version)
    // console.log(this.injectedWeb3.eth.netw)
    const networkId = this.injectedWeb3.version.network
    // const networkId = this.injectedWeb3.version.getNetwork()
    // const networkId = this.injectedWeb3.version.network
    const idNameMap = {
      1: 'Main Ethereum Network',
      2: 'Morden Test Network (deprecated)',
      3: 'Ropsten Test Network',
      4: 'Rinkeby Test Network',
      undefined: 'No Network',
    }

    return idNameMap[networkId] || 'Unknown Network'
  }

  public firstAccount = async (): Promise<string | undefined> =>
    (await this.accounts())[0]

  public accounts = async (): Promise<string[]> => {
    return new Promise((resolve: (value: string[]) => any, reject) => {
      if (!this.isMetamaskActive()) {
        resolve([])
      }

      this.web3.eth.getAccounts(
        (error, accounts) => (error ? reject(error) : resolve(accounts))
      )
    })
  }

  public isValidAddress = (text: string) => this.web3.isAddress(text)
}

export {Ethereum}
