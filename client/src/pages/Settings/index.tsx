import * as DateFns from 'date-fns'
import * as React from 'react'
import {getPersonInStorage, ISettings, setPersonInStorage} from '../../api'

export const defaultSettings = {costPerMiss: 500, notesPerWeek: 2}

class Settings extends React.Component<{address: string}, ISettings> {
  public state = defaultSettings

  public render() {
    const user = this.currentUser()
    if (user === undefined) {
      return 'Please sign in'
    }
    const weekfromNow = DateFns.addWeeks(new Date(), 1)
    const comingDueDate = DateFns.subSeconds(DateFns.startOfWeek(weekfromNow), 1)
    return (
      <div>
        <br />I will submit <this.NotesPerWeekInput /> notes per week, and
        <br />I will pay $<this.CostPerMissInput /> for each note I fail to submit.
        <br />
        This week's notes will come due at{' '}
        <code>{DateFns.format(comingDueDate, 'HH:mm')}</code> on{' '}
        <code>{DateFns.format(comingDueDate, 'D MMM YYYY')}</code>.<br />
        <br />
        <button className="btn btn-primary" onClick={this.updateSettings}>
          Update settings
        </button>
      </div>
    )
  }

  private NotesPerWeekInput = () => (
    <div className="input-group input-inline">
      <input
        className="form-input"
        type="number"
        value={this.state.notesPerWeek}
        onChange={this.onAttributeChange('notesPerWeek')}
      />
    </div>
  )

  private CostPerMissInput = () => (
    <div className="input-group input-inline">
      <input
        className="form-input"
        type="number"
        value={this.state.costPerMiss}
        onChange={this.onAttributeChange('costPerMiss')}
      />
    </div>
  )

  private onAttributeChange = (attributeName: 'costPerMiss' | 'notesPerWeek') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({...this.state, [attributeName]: Number(event.target.value)})
  }

  private updateSettings = () => {
    const retrieved = getPersonInStorage(this.props.address)
    if (retrieved instanceof Error) {
      return alert(retrieved)
    }
    console.log(retrieved)
    const user = {...retrieved, settings: this.state}
    setPersonInStorage(user)
  }

  private currentUser = () => {
    const retrieved = getPersonInStorage(this.props.address)
    if (retrieved instanceof Error) {
      return undefined
    }
    return retrieved
  }
}

export default Settings
