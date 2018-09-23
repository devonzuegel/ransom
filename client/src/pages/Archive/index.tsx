import * as DateFns from 'date-fns'
import * as React from 'react'
import {Link} from 'react-router-dom'
import {getPerson, IPerson} from '../../api'

interface IState {
  currentUser: IPerson | undefined
}

class Notes extends React.Component<{address: string}, IState> {
  public state: IState = {currentUser: undefined}

  public componentDidMount = async () => {
    this.setState({currentUser: await this.currentUser()})
  }

  public render() {
    const user = this.state.currentUser
    if (user === undefined) {
      return 'Please sign in'
    }

    console.log(user)
    console.log(user.notes)
    if (user.notes.length === 0) {
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="icon icon-emoji icon-3x" />
          </div>
          <p className="empty-title h5">You have no notes yet</p>
          <div className="empty-action">
            <Link to="/" className="btn btn-primary">
              Go write one!
            </Link>
          </div>
        </div>
      )
    }
    return (
      // TODO: Separate by challenge time periods
      <div className="columns notes">
        {user.notes.map((note, i) => (
          <div key={i} className="column col-6 col-xs-12">
            <div className="card">
              <div className="card-header">
                {/* <div className="card-title h5">...</div> */}
                <div className="card-subtitle text-gray">
                  {DateFns.format(new Date(note.createdAt), 'D MMM YYYY, HH:mm')}
                </div>
              </div>
              <div className="card-body">{note.content}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  private currentUser = async () => {
    const retrieved = await getPerson(this.props.address)
    if (retrieved instanceof Error) {
      return undefined
    }
    return retrieved
  }
}
const Archive = (props: {address: string}) => (
  <div>
    <Notes {...props} />
  </div>
)

export default Archive
