import * as React from 'react'
import {getPersonInStorage, setPersonInStorage} from '../../api'

class Settings extends React.Component<
  {address: string},
  {costPerMiss: number; notesPerWeek: number}
> {
  public state = {costPerMiss: 500, notesPerWeek: 2}
  public render() {
    const user = this.currentUser()
    if (user === undefined) {
      return 'Please sign in'
    }
    return (
      <div>
        <br />I will submit <this.NotesPerWeekInput /> notes per week, and
        <br />I will pay $<this.CostPerMissInput /> for each note I fail to submit.
        <br />
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
        onKeyDown={this.submitOnEnter}
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
        onKeyDown={this.submitOnEnter}
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

  private submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && e.metaKey) {
      // TODO:
    }
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
