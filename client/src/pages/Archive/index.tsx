import * as DateFns from 'date-fns'
import * as React from 'react'
import {getPersonInStorage} from '../../api'

class Notes extends React.Component<{address: string}> {
  public render() {
    const user = this.currentUser()
    if (user === undefined) {
      return 'Please sign in'
    }
    return (
      <div>
        {user.notes.map((note, i) => (
          <div key={i}>
            <div className="label">
              {DateFns.format(new Date(note.createdAt), 'D MMM YYYY, HH:mm')}
            </div>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    )
  }

  private currentUser = () => {
    const retrieved = getPersonInStorage(this.props.address)
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
