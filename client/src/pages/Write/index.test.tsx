import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {StaticRouter} from 'react-router'
import App from '.'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <StaticRouter>
      <App address="foo" />
    </StaticRouter>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
