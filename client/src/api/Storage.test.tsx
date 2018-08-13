import {Storage} from './Storage'

it('sets and gets a key', () => {
  const obj = {x: Math.random()}
  Storage.set('foo', obj)
  expect(Storage.get('foo')).toEqual(obj)
})

it('sets and gets a nested key', () => {
  const obj = {x: {y: Math.random()}}
  Storage.set('foo', obj)
  expect(Storage.get('foo')).toEqual(obj)
})
