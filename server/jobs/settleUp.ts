import * as format from 'date-fns/format'
import {client} from '@server/users'
import {IChallenge} from '@client/pages/Write'

const formatDateForSql = (date: Date) => format(date, 'YYYY-MM-DD HH:mm:ss')

const getNotesThatMeetChallenge = async (challenge: IChallenge) => {
  const {numWords} = challenge
  const [startDate, endDate] = [challenge.createdAt, challenge.dueAt]
  return (await client.query(
    `SELECT * FROM notes WHERE ` +
      `"createdAt" >= '${formatDateForSql(startDate)}' AND` +
      `"createdAt" <= '${formatDateForSql(endDate)}' AND ` +
      `LENGTH("content") >= ${numWords};`
  )).rows
}

const getDueUnsettledChallenges = async () =>
  (await client.query(
    `SELECT * FROM challenges WHERE "dueAt" <= now() AND settled = false;`
  )).rows

const createTx = (userAddress: string, centsOwed: number, description: string) =>
  client.query(
    `INSERT INTO "transactions" ("userAddress", "description", "centsOwed") ` +
      `VALUES ('${userAddress}', '${description}', '${centsOwed}');`
  )

export const settleUp = async () => {
  const dueUnsettledChallenges: IChallenge[] = await getDueUnsettledChallenges()

  for (let i = 0; i < dueUnsettledChallenges.length; i++) {
    const challenge = dueUnsettledChallenges[i]
    const completedNotes = await getNotesThatMeetChallenge(challenge)

    // TODO: Charge to Stripe/Ethereum
    const numCommitted = challenge.numNotes
    const numCompleted = completedNotes.length
    const centsOwed = challenge.centsPerMissedNote * (numCommitted - numCompleted)
    const description =
      `User completed ${numCompleted} of ${numCommitted} notes of ` +
      `${challenge.numWords} or more in time period ${challenge.createdAt} - ` +
      `${challenge.dueAt} at a rate of ${challenge.centsPerMissedNote} ` +
      `cents per missed note.`
    const computedStats = {numCommitted, numCompleted, centsOwed, description}

    await createTx(challenge.userAddress, centsOwed, description)

    console.log()
    console.log('challenge:', JSON.stringify(challenge, null, 2))
    console.log()
    console.log('completedNotes:', JSON.stringify(completedNotes, null, 2))
    console.log()
    console.log('computed:', JSON.stringify(computedStats, null, 2))
    console.log()
    console.log()
  }
}
