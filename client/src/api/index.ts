import {get} from './http'
import {IObject, ParseError, Storage} from './Storage'

export const setPerson = (person: IPerson) => {
  // TODO: Set person on backend
  setPersonInStorage(person)
}

const setPersonInStorage = (person: IPerson) => {
  Storage.set(person.address, person)
}

export const getPerson = async (ethAddress: string) => {
  // TODO: Get person from backend
  const result = await get<IPerson>(`/api/users/${ethAddress}`)
  if (result instanceof Error) {
    alert('Failure!')
  }
  return result
  // return getPersonInStorage(ethAddress)
}

// const getPersonInStorage = (ethAddress: string) => {
//   const retrieved = Storage.get(ethAddress)
//   if (retrieved instanceof Error) {
//     return retrieved
//   }
//   return validatePersonObj(retrieved)
// }

export const clearUser = (address: string) => {
  // TODO: Get person from backend
  clearUserInStorage(address)
}
export const clearUserInStorage = (address: string) => {
  Storage.clear(address)
}

/******************************************************************************************
 ******************************************************************************************/

export const validateNoteObj = (noteObj: IObject): INote | ParseError => {
  if (typeof noteObj.content !== 'string') {
    return new ParseError(`Invalid note content: ${noteObj.content}`)
  }
  const parsedDate = new Date(noteObj.createdAt)
  if (!noteObj.createdAt || !(parsedDate instanceof Date)) {
    return new ParseError(`Invalid note createdAt: ${noteObj.createdAt}`)
  }
  return {content: noteObj.content, createdAt: noteObj.createdAt}
}

export const validatePersonObj = (personObj: IObject) => {
  // TODO: add more validations on the eth address
  if (typeof personObj.address !== 'string') {
    return new ParseError('Not a valid eth address')
  }
  if (!(personObj.notes instanceof Array)) {
    return new ParseError('Invalid notes')
  }
  for (const note of personObj.notes) {
    const error = validateNoteObj(note)
    if (error instanceof Error) {
      return error
    }
  }
  return personObj as IPerson
}

export interface INote {
  createdAt: Date
  content: string
}

export interface ISettings {
  costPerMiss: number
  notesPerWeek: number
}

export interface IPerson {
  address: string
  notes: INote[]
  settings: ISettings
}
