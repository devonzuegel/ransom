import * as classnames from 'classnames'
import * as React from 'react'

interface IStepProps {
  optional?: boolean
  complete?: boolean
}

const Step: React.SFC<IStepProps> = props => (
  <li
    className={classnames({
      setup__step: true,
      'setup__step--complete': props.complete,
      'setup__step--optional': props.optional,
    })}>
    <input type="checkbox" checked={props.complete} />
    <span className="setup__step__text">{props.children}</span>
  </li>
)

interface ISetupStatelessProps {
  metamaskInstalled: boolean
  metamaskUnlocked: boolean
  ethAddress: string
  header: React.ReactNode
  description: React.ReactNode
  returningUser?: boolean
  onMetamaskInstallClick: () => void
  children: (props: ISetupStatelessProps) => React.ReactNode
}

const isDone = (props: ISetupStatelessProps) =>
  props.metamaskInstalled && props.metamaskUnlocked

const SetupStateless: React.SFC<ISetupStatelessProps> = props => {
  if (isDone(props)) {
    return <div className="setup-steps--done-wrapper">{props.children(props)}</div>
  }

  return (
    <div>
      <h1>{props.header}</h1>
      <p>{props.description}</p>

      <h2>{props.returningUser ? 'Welcome back to Ransom' : 'Welcome to Ransom'}</h2>
      <p>
        {props.returningUser
          ? 'Make sure to complete the steps below to sign in to Ransom'
          : 'Make sure to complete the steps below to set up Ransom'}
      </p>
      <ul>
        <Step complete={props.metamaskInstalled}>
          <a onClick={props.onMetamaskInstallClick}>Install Metamask</a> on your
          browser
        </Step>
        <Step complete={props.metamaskUnlocked}>
          Sign in to and unlock your Metamask
        </Step>
      </ul>
    </div>
  )
}

export {SetupStateless, ISetupStatelessProps}
