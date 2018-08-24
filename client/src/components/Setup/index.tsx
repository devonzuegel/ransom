import * as React from 'react'

import {Ethereum} from '../../Ethereum'
import {sitemap} from '../../sitemap'

import {ISetupStatelessProps, SetupStateless} from './stateless'

declare global {
  /* tslint:disable-next-line:interface-name */
  interface Window {
    AirSwap: any
  }
}

interface ISetupProps {
  ethereum?: Ethereum
  header: React.ReactNode
  description: React.ReactNode
  requireBLT?: boolean
  returningUser?: boolean
  children: (props: ISetupStatelessProps) => React.ReactNode
}

interface ISetupState {
  metamaskInstalled: boolean
  metamaskUnlocked: boolean
  boughtBLT: boolean

  waitingForMetamask: boolean

  ethAddress: string
}

class Setup extends React.Component<ISetupProps, ISetupState> {
  public static defaultProps: Partial<ISetupProps> = {}

  public readonly state: ISetupState = {
    boughtBLT: false,
    ethAddress: '',
    metamaskInstalled: false,
    metamaskUnlocked: false,
    waitingForMetamask: false,
  }

  private iframeRef: React.RefObject<HTMLIFrameElement>

  private installInterval: NodeJS.Timer
  private unlockInterval: NodeJS.Timer

  constructor(props: ISetupProps) {
    super(props)
    this.iframeRef = React.createRef()
  }

  public componentDidMount() {
    this.checkForMetamaskInstalled()
    this.checkForMetamaskUnlocked()

    this.pollForAll()
  }

  public componentWillUnmount() {
    global.clearInterval(this.installInterval)
    global.clearInterval(this.unlockInterval)
  }

  public render() {
    return (
      <React.Fragment>
        {this.renderIframe()}
        <SetupStateless
          header={this.props.header}
          description={this.props.description}
          returningUser={this.props.returningUser}
          metamaskInstalled={this.state.metamaskInstalled}
          metamaskUnlocked={this.state.metamaskUnlocked}
          ethAddress={this.state.ethAddress}
          onMetamaskInstallClick={this.handleMetamaskInstallClick}>
          {this.props.children}
        </SetupStateless>
      </React.Fragment>
    )
  }

  private checkForMetamaskUnlocked = () => {
    if (!this.props.ethereum) {
      return
    }

    this.props.ethereum
      .firstAccount()
      .then(account => {
        if (account) {
          global.clearInterval(this.unlockInterval)

          this.setState(() => ({
            ethAddress: account,
            metamaskUnlocked: true,
          }))
        }
      })
      .catch(() => undefined)
  }

  private checkForMetamaskInstalled = () => {
    const metamaskInstalled =
      this.props.ethereum !== undefined && this.props.ethereum.isMetamaskActive()

    if (metamaskInstalled) {
      global.clearInterval(this.installInterval)
      this.setState({metamaskInstalled})
    }
  }

  private pollForAll = () => {
    global.clearInterval(this.unlockInterval)
    this.unlockInterval = global.setInterval(this.checkForMetamaskUnlocked, 500)

    global.clearInterval(this.installInterval)
    this.installInterval = global.setInterval(this.checkForMetamaskInstalled, 500)
  }

  private handleMetamaskInstallClick = () => {
    window.open(sitemap.installMetamask)
    this.setState(() => ({waitingForMetamask: true}))
  }

  private renderIframe = () => {
    if (!this.state.waitingForMetamask) {
      return
    }

    return (
      <iframe
        src={'/check-for-metamask.html'}
        ref={this.iframeRef}
        style={{display: 'none'}}
      />
    )
  }
}

export {Setup}
