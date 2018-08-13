export interface IObject {
  [k: string]: any
}

export class ParseError extends Error {}

export const Storage = {
  get: (key: string): IObject | ParseError => {
    const unparsed = localStorage.getItem(key)
    if (unparsed === null) {
      return new ParseError(`Cannot find "${key}" in local storage`)
    }
    return JSON.parse(unparsed)
  },

  set: (key: string, item: IObject) => {
    return localStorage.setItem(key, JSON.stringify(item))
  },

  clear: (key: string) => {
    localStorage.removeItem(key)
  },
}
