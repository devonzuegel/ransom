import * as express from 'express'
import * as path from 'path'

const app = express()

// Serve static files from the React app, found under build/client
app.use(express.static(path.join(__dirname, '../client')))

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname + '../client/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening at http://localhost:${port}`)
