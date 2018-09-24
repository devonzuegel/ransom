import {settleUp} from '@server/jobs/settleUp'
import {client} from '@server/users'

settleUp()
  .then(async => {
    console.log('Done!')
    client.end()
  })
  .catch(e => {
    console.warn(e)
    client.end()
  })
