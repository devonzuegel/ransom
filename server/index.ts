import * as express from 'express'
import * as path from 'path'

import {allUsers, getUser} from './users' // TODO

const app = express()

// Serve static files from the React app, found under build/client
app.use(express.static(path.join(__dirname, '/../client')))

app.get('/api/users', async (req, res) => {
  try {
    const users = await allUsers()
    return res.json(users)
  } catch (error) {
    console.error(error)
    return res.json('Sorry, something went wrong')
  }
})

app.get('/api/users/:ethAddress', async (req, res) => {
  try {
    console.log(req.params.ethAddress)
    const ethAddress = req.params.ethAddress
    if (ethAddress === undefined || !(typeof ethAddress === 'string')) {
      throw Error('ethAddress must be a defined string')
    }
    const users = await getUser(ethAddress)
    if (users.length !== 1) {
      throw Error(`Expected 1 user but received ${users.length}`)
    }
    return res.json(users[0].data)
  } catch (error) {
    console.error(error)
    return res.json('Sorry, something went wrong')
  }
})

app.post('/api/users', async (req, res) => {
  // TODO
  console.log({body: req.body})
  // try {
  //   const user = await addUser(req.body)
  // } catch (error) {}
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname + '/../client/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening at http://localhost:${port}`)
