import {IChallenge} from '../pages/Write'
import * as http from './http'
import {IObject, ParseError} from './Storage'

export const setPerson = async (person: IPerson) => {
  const validationResult = validatePersonObj(person)
  if (validationResult instanceof Error) {
    return validationResult
  }
  try {
    const result = await http.post<IPerson>(
      `/api/users/${person.address}`,
      validationResult
    )
    if (result instanceof Error) {
      return alert(result)
    }
    return result
  } catch (error) {
    console.error({error})
  }
}

export const getPerson = async (ethAddress: string) => {
  // TODO: Get person from backend
  const result = await http.get<IPerson>(`/api/users/${ethAddress}`)
  if (result instanceof Error) {
    alert('Failure!')
  }
  return result
}

export const getChallenges = async (ethAddress: string) => {
  // TODO: Get person from backend
  // TODO: Use IChallenge from shared (requires ejecting)
  const result = await http.get<IChallenge[]>(`/api/users/${ethAddress}/challenges`)
  if (result instanceof Error) {
    alert('Failure!')
  }
  return result
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
