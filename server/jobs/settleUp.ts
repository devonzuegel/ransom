import * as format from 'date-fns/format'
import {client} from '@server/users'
import {IChallenge} from '@client/pages/Write'

const formatDateForSql = (date: Date) => format(date, 'YYYY-MM-DD HH:mm:ss')

export const settleUp = async () => {
  const dueUnsettledChallenges: IChallenge[] = (await client.query(
    `SELECT * FROM challenges WHERE "dueAt" <= now() AND settled = false;`
  )).rows

  for (let i = 0; i < dueUnsettledChallenges.length; i++) {
    const challenge = dueUnsettledChallenges[i]
    const completedNotes = (await client.query(
      `SELECT * FROM notes WHERE ` +
        `"createdAt" >= '${formatDateForSql(challenge.createdAt)}' AND` +
        `"createdAt" <= '${formatDateForSql(challenge.dueAt)}';`
    )).rows

    const numCommitted = challenge.numNotes
    const numCompleted = completedNotes.length
    console.log()
    console.log('challenge:', JSON.stringify(challenge, null, 2))
    console.log()
    console.log('completedNotes:', JSON.stringify(completedNotes, null, 2))
    const centsOwed = challenge.centsPerMissedNote * (numCommitted - numCompleted)
    console.log()
    console.log(
      'computed:',
      JSON.stringify({numCommitted, numCompleted, centsOwed}, null, 2)
    )
    console.log()
    console.log()
  }
  // dueUnsettledChallenges.rows.forEach(async (challenge: IChallenge) => {})
  // TODO: Charges to Stripe/Ethereum
  // }
  // for (const challenge in dueUnsettledChallenges.rows) {
}
