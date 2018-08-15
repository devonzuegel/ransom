import {get} from 'lodash'
import * as Web3 from 'web3'

export class Ethereum {
  constructor(private injectedWeb3?: Web3) {}

  public isMetamaskActive = () =>
    get(this.injectedWeb3, 'currentProvider.isMetaMask') === true

  public currentNetwork = () => {
    if (!this.injectedWeb3 || !this.injectedWeb3.version) {
      return 'No Network'
    }

    const networkId = this.injectedWeb3.version.network
    const idNameMap = {
      1: 'Main Ethereum Network',
      2: 'Morden Test Network (deprecated)',
      3: 'Ropsten Test Network',
      4: 'Rinkeby Test Network',
      undefined: 'No Network',
    }

    return idNameMap[networkId] || 'Unknown Network'
  }

  public firstAccount = async (): Promise<string | null> =>
    (await this.accounts())[0] || null

  private accounts = async (): Promise<string[]> =>
    new Promise((resolve: (value: string[]) => any, reject) => {
      if (!this.isMetamaskActive() || !this.injectedWeb3) {
        return resolve([])
      }

      this.injectedWeb3.eth.getAccounts(
        (error, accounts) => (error ? reject(error) : resolve(accounts))
      )
    })
}
