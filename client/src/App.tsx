import * as DateFns from 'date-fns'
import * as React from 'react'
import {clearUser, getPersonInStorage, IPerson, setPersonInStorage} from './api'
import './App.css'

const address = 'devon'

class Notes extends React.Component<{user: IPerson}> {
  public render() {
    return (
      this.props.user && (
        <div>
          {this.props.user.notes.map(note => (
            <div>
              <h2>
                {DateFns.format(new Date(note.createdAt), 'D MMM YYYY, HH:mm')}
              </h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )
    )
  }
}

class App extends React.Component<{}, {note: string; user: any}> {
  public state = {note: '', user: undefined}

  public render() {
    const user = this.currentUser()
    return (
      <div className="App">
        <h3>Write or paste your note here</h3>
        <textarea autoFocus onChange={this.onNoteChange} />
        {!this.currentUser() && <button onClick={this.signup}>Sign up</button>}
        <button onClick={this.persistNote}>Submit note</button>
        {user && <Notes user={user} />}
        <button onClick={this.clearStorage}>Clear storage</button>
        <hr />
        <pre style={{textAlign: 'left'}}>
          {JSON.stringify({person: getPersonInStorage(address)}, null, 2)}
        </pre>
      </div>
    )
  }

  public componentDidMount() {
    this.updateView()
  }

  private updateView = () => {
    const user = getPersonInStorage(address)
    this.setState({user})
  }

  private signup = () => {
    setPersonInStorage({address, notes: []})
    this.updateView()
  }

  private currentUser = () => {
    const retrieved = getPersonInStorage(address)
    if (retrieved instanceof Error) {
      return undefined
    }
    return retrieved
  }
  private onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({note: event.target.value})
  }

  private persistNote = () => {
    const retrieved = getPersonInStorage(address)
    if (retrieved instanceof Error) {
      return alert(retrieved)
    }
    const user = {
      address,
      notes: [
        ...retrieved.notes,
        {
          content: this.state.note,
          createdAt: new Date(),
        },
      ],
    }
    setPersonInStorage(user)
    this.updateView()
  }

  private clearStorage = () => {
    clearUser(address)
    this.updateView()
  }
}

export default App
