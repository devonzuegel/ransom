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

// TODO: Inject client and make users agnostic to db
export const client = new pg.Client(env.DATABASE_URL)
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

export const updateUserData = async (ethAddress: string) => {
  console.log(`Updating user with ethAddress ${ethAddress}`)
  const result = await client.query(
    `UPDATE "public"."users" SET "data" = ` +
      `'{"notes": [{"content": "updated again!", "createdAt": "2018-09-22 20:50:31.016282"},{"content": "xxxx", "createdAt": "2018-09-22 20:52:31.016282"}], "address": "0x9cbe5b896d0c24acf41860b9e3df6750c2040a40", "settings": {"costPerMiss": 500, "notesPerWeek": 2}}' ` +
      `WHERE "address" = '${ethAddress}';`
  )
  console.log(result)
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
