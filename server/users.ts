import * as pg from 'pg'
const conString = 'postgres://devonzuegel@localhost:5432/ransom-dev'

const client = new pg.Client(conString)
client.connect()

type TUser = [string, {[k: string]: any}]

export const allUsers = async () => {
  const result = await client.query('SELECT * from users;')
  return result.rows
}

export const addUser = async (
  ethAddress: string,
  data: object
): Promise<TUser | Error> => {
  try {
    const result = await client.query(
      `
        INSERT INTO users
        VALUES ('${ethAddress}', '${JSON.stringify(data)}');
    `
    )
    return [ethAddress, result]
  } catch (error) {
    console.error(error)
    return new Error('lkjlkj')
  }
}
