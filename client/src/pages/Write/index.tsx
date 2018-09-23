import * as React from 'react'
import {Link} from 'react-router-dom'
import {getChallenges, getPerson, setPerson} from '../../api'
import {defaultSettings} from '../Settings'

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

// TODO: Use IChallenge from shared (requires ejecting)
export interface IChallenge {
  dueAt: Date
}

interface IActiveChallengesState {
  challenges: IChallenge[]
}

class ActiveChallenges extends React.Component<
  {address: string},
  IActiveChallengesState
> {
  public state: IActiveChallengesState = {challenges: []}

  public render() {
    const activeChallenges = this.state.challenges.filter(
      challenge => new Date(challenge.dueAt) > new Date()
    )
    if (activeChallenges.length === 0) {
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="icon icon-emoji icon-3x" />
          </div>
          <p className="empty-title h5">You have no active challenges</p>
          <div className="empty-action">
            <Link to="/" className="btn btn-primary">
              Create one
            </Link>
          </div>
        </div>
      )
    }
    return (
      <div>
        <h1 className="h1">Active challenges</h1>
        {activeChallenges.map((challenge, i) => (
          <pre key={i} className="code" data-lang="JSON">
            <code>{JSON.stringify(challenge, null, 2)}</code>
          </pre>
        ))}
      </div>
    )
  }
  public componentDidMount = async () => {
    const result = await getChallenges(this.props.address)
    if (result instanceof Error) {
      return alert(result)
    }
    this.setState({challenges: result})
  }
}

class App extends React.Component<{address: string}, {note: string; user: any}> {
  public state = {note: '', user: undefined}

  public render() {
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
          </div>

          <div className="column col-6">
            <ActiveChallenges address={this.props.address} />
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
    const user = getPerson(this.props.address)
    this.setState({user})
  }

  private signup = async () => {
    await setPerson({
      address: this.props.address,
      notes: [],
      settings: defaultSettings,
    })
    this.updateView()
  }

  private currentUser = () => {
    const retrieved = getPerson(this.props.address)
    if (retrieved instanceof Error) {
      return undefined
    }
    return retrieved
  }
  private onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({note: event.target.value})
  }

  private persistNote = async () => {
    const retrieved = await getPerson(this.props.address)
    if (retrieved instanceof Error) {
      return alert(retrieved)
    }
    const user = {
      address: this.props.address,
      notes: [...retrieved.notes, {content: this.state.note, createdAt: new Date()}],
      settings: retrieved.settings,
    }
    setPerson(user)
    this.updateView()

    // TODO: Make this nicer
    alert('Congrats on submitting a post! You can go see it on the archive page')
  }
}

export default App
