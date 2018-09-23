import * as DateFns from 'date-fns'
import * as React from 'react'
import {getPersonInStorage, IPerson, setPersonInStorage} from '../../api'

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

const NewPost = (props: {
  submitOnEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  persistNote: () => void
}) => (
  <div>
    <p>Write or paste your note here</p>
    <div className="form-group">
      <div className="input-group">
        <textarea
          className="form-input"
          autoFocus
          onKeyDown={props.submitOnEnter}
          onChange={props.onNoteChange}
        />
      </div>
    </div>
    <br />
    <button className="btn btn-primary" onClick={props.persistNote}>
      Submit note
    </button>
  </div>
)

const LocalStorageViewer = (props: {address: string}) => (
  <div>
    <br />

    <div className="accordion">
      <input type="checkbox" id="accordion-1" name="accordion-checkbox" hidden />
      <label className="accordion-header" htmlFor="accordion-1">
        <i className="icon icon-arrow-right mr-1" />
        Local storage
      </label>
      <div className="accordion-body">
        <pre className="pre local-storage code" data-lang="JSON">
          <code>
            {JSON.stringify({person: getPersonInStorage(props.address)}, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  </div>
)

class App extends React.Component<
  {address: string; firstName: string},
  {note: string; user: any}
> {
  public state = {note: '', user: undefined}

  public render() {
    const user = this.currentUser()
    return (
      <div>
        <div className="columns">
          <div className="column col-6">
            {this.currentUser() ? (
              <NewPost
                submitOnEnter={this.submitOnEnter}
                onNoteChange={this.onNoteChange}
                persistNote={this.persistNote}
              />
            ) : (
              <button className="btn btn-primary" onClick={this.signup}>
                Sign up
              </button>
            )}
            <LocalStorageViewer {...this.props} />
          </div>
          <div className="column col-6 main-right-column">
            {user && <Notes user={user} />}
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
}

export default App