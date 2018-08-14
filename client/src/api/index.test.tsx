import {validatePersonObj} from '.'
import {ParseError} from './Storage'

describe('validatePersonObj', () => {
  it('returns an error if the address does not exist', () => {
    expect(validatePersonObj({notes: [1, 2, 3]})).toEqual(
      new ParseError('Not a valid eth address')
    )
  })

  it('pass if invalid content', () => {
    const validPersonObj = {
      address: 'foo',
      notes: [{createdAt: new Date()}],
    }
    expect(validatePersonObj(validPersonObj)).toEqual(
      new ParseError('Invalid note content: undefined')
    )
  })

  it('pass if invalid date', () => {
    const validPersonObj = {
      address: 'foo',
      notes: [{content: 'xxx'}],
    }
    expect(validatePersonObj(validPersonObj)).toEqual(
      new ParseError('Invalid note createdAt: undefined')
    )
  })

  it('pass if valid structure', () => {
    const validPersonObj = {
      address: 'foo',
      notes: [{content: 'x', createdAt: new Date()}],
    }
    expect(validatePersonObj(validPersonObj)).toEqual(validPersonObj)
  })

  xit('TODO', () => {
    class NoteParseError extends ParseError {
      public name: 'x'
    }

    const e = new ParseError(`Invalid note content`)
    if (e instanceof NoteParseError) {
      console.log('this should not happen')
    }
    const e2 = new NoteParseError(`Invalid note content`)
    if (e2 instanceof NoteParseError) {
      console.log('this SHOULD happen')
    }
    console.log({message: e.message})
  })
})
