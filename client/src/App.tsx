import * as React from 'react'
import * as http from './api/http'
import './App.css'

import logo from './logo.svg'

class App extends React.Component<{}, {results: string[]}> {
  public render() {
    http.get('/foo').then(r => console.log({r}))
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
