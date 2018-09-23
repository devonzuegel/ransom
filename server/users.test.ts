import {updateUserData, client} from '@server/users'

// TODO: Shouldn't touch db
it('updates user data', async () => {
  try {
    await updateUserData('0x9cbe5b896d0c24acf41860b9e3df6750c2040a40')
    await client.end()
  } catch (error) {
    console.error(error)
  }
})
