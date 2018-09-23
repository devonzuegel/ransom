import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from '.'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App firstName="Bowser" address="foo" />, div)
  ReactDOM.unmountComponentAtNode(div)
})