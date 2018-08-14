import * as DateFns from 'date-fns'
import * as React from 'react'
import {clearUser, getPersonInStorage, IPerson, setPersonInStorage} from './api'

class Notes extends React.Component<{user: IPerson}> {
  public render() {
    return (
      this.props.user && (
        <div>
          {this.props.user.notes.map((note, i) => (
            <div key={i}>
              <div className="label">
                {DateFns.format(new Date(note.createdAt), 'D MMM YYYY, HH:mm')}
              </div>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )
    )
  }
}

class App extends React.Component<{address: string}, {note: string; user: any}> {
  public state = {note: '', user: undefined}

  public render() {
    const user = this.currentUser()
    return (
      <div className="container">
        <header className="navbar">
          <section className="navbar-section">
            <span className="label label-rounded">Ransom</span>
          </section>
          <section className="navbar-section">
            <button className="btn btn-sm btn-primary" onClick={this.clearStorage}>
              Clear storage
            </button>
          </section>
        </header>

        <div className="columns">
          <div className="column col-6">
            <p>Write or paste your note here</p>
            <div className="form-group">
              <div className="input-group">
                <textarea
                  className="form-input"
                  autoFocus
                  onKeyDown={this.submitOnEnter}
                  onChange={this.onNoteChange}
                />
              </div>

              <br />
              {this.currentUser() ? (
                <button className="btn" onClick={this.persistNote}>
                  Submit note
                </button>
              ) : (
                <button className="btn" onClick={this.signup}>
                  Sign up
                </button>
              )}
            </div>
          </div>
          <div className="column col-6">
            {user && <Notes user={user} />}
            <pre style={{textAlign: 'left'}}>
              {JSON.stringify(
                {person: getPersonInStorage(this.props.address)},
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  public componentDidMount() {
    this.updateView()
  }

  private submitOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.metaKey) {
      this.persistNote()
    }
  }

  private updateView = () => {
    const user = getPersonInStorage(this.props.address)
    this.setState({user})
  }

  private signup = () => {
    setPersonInStorage({address: this.props.address, notes: []})
    this.updateView()
  }

  private currentUser = () => {
    const retrieved = getPersonInStorage(this.props.address)
    if (retrieved instanceof Error) {
      return undefined
    }
    return retrieved
  }
  private onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({note: event.target.value})
  }

  private persistNote = () => {
    const retrieved = getPersonInStorage(this.props.address)
    if (retrieved instanceof Error) {
      return alert(retrieved)
    }
    const user = {
      address: this.props.address,
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
    clearUser(this.props.address)
    this.updateView()
  }
}

export default App
