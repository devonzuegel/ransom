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

  public firstAccount = async (): Promise<string | null> => {
    const account = (await this.accounts())[0]
    return account || null
  }
  private accounts = async (): Promise<string[]> =>
    new Promise((resolve: (value: string[]) => any, reject) => {
      if (!this.injectedWeb3 || !this.isMetamaskActive()) {
        return reject('Metamask is not active')
      }

      this.injectedWeb3.eth.getAccounts((error, accounts) => {
        if (error) {
          return reject(error)
        }
        if (accounts.length === 0) {
          console.warn(
            'This should not occur. For Metamask to be open, it must have at',
            'least one active account in the list.'
          )
          return reject('No accounts found')
        }
        return resolve(accounts)
      })
    })
}
