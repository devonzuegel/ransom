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

class App extends React.Component<
  {address: string; firstName: string},
  {note: string; user: any}
> {
  public state = {note: '', user: undefined}

  public render() {
    const user = this.currentUser()
    return (
      <div className="container">
        <header className="navbar">
          <section className="navbar-section">
            <a className="btn btn-link">Write</a>
            <a className="btn btn-link">Archive</a>
          </section>

          <div className="popover popover-bottom">
            <div className="tile tile-centered">
              <div className="tile-icon">
                <div className="example-tile-icon">
                  <i className="icon icon-people icon-2x centered" />
                </div>
              </div>
              <div className="tile-content">
                <div className="tile-title">Hello, {this.props.firstName}!</div>
                <div className="tile-subtitle text-gray subtext-code">
                  {this.props.address.substr(0, 6)}
                  ..
                  {this.props.address.substr(this.props.address.length - 4, 4)}
                </div>
              </div>
            </div>

            <div className="popover-container account-info">
              <div className="card">
                <div className="card-body">
                  Signed in as: <code>{this.props.address}</code>
                </div>
                <div className="card-body">
                  <button
                    className="btn btn-sm btn-primary input-group-btn"
                    onClick={this.clearStorage}>
                    Clear storage
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          <div className="column col-6 main-right-column">
            {user && <Notes user={user} />}
            <pre className="pre local-storage" style={{textAlign: 'left'}}>
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
