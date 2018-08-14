import * as classnames from 'classnames'
import * as React from 'react'

import './index.css'

interface IProps {
  address: string
  email?: string
}
interface IState {
  showAddress: boolean
}

class PeekMetamaskAddress extends React.Component<IProps, IState> {
  public state = {showAddress: false}

  public onClick = () => this.setState({showAddress: !this.state.showAddress})

  public render() {
    return (
      <div className="identity-block" onClick={this.onClick}>
        <div className="identity-block__inner">
          {this.props.email && (
            <div className="email-address-welcome">Welcome, {this.props.email}</div>
          )}
          <div
            className={classnames({
              ['metamask-address']: true,
              ['visible']: this.state.showAddress,
              ['hidden']: !this.state.showAddress,
            })}>
            {this.props.address}
          </div>
          <div
            className={classnames({
              ['metamask-address-hidden-msg']: true,
              ['visible']: !this.state.showAddress,
              ['hidden']: this.state.showAddress,
            })}>
            See MetaMask address
          </div>
        </div>
      </div>
    )
  }
}

export {PeekMetamaskAddress}
