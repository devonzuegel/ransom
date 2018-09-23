import * as pg from 'pg'
import * as dotenv from 'dotenv'

// TODO: SQL injection is definitely possible right now. Fix that!

// TODO: Validate env variables
dotenv.config()

// Throw an error if the specified environment variable is not defined
const environmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Expected environment variable ${name}`)
  }
  return value
}

export const env = {
  DATABASE_URL: environmentVariable('DATABASE_URL'),
}

const client = new pg.Client(env.DATABASE_URL)
client.connect().catch(e => {
  console.error(
    `Could not connect to database [${env.DATABASE_URL || process.env.DATABASE_URL}]`
  )
  console.error(e)
})

type TUser = [string, {[k: string]: any}]

export const allUsers = async () => {
  console.log('Retrieving users...')
  const result = await client.query('SELECT * from users;')
  return result.rows
}

export const getUser = async (ethAddress: string) => {
  console.log(`Retrieving user with ethAddress ${ethAddress}`)
  const result = await client.query(
    `SELECT * from users where address = '${ethAddress}';`
  )
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
