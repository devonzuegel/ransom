import * as pg from 'pg'
import * as dotenv from 'dotenv'

// TODO: Validate env variables
const env = dotenv.load()

if (!env.parsed) {
  throw Error('Could not load environment')
}

const client = new pg.Client(env.parsed.DATABASE_URL || process.env.DATABASE_URL)
client.connect().catch(console.error)

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
    return new Error('Error while inserting user')
  }
}
