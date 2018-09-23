import * as format from 'date-fns/format'
import {serverLogger} from '@server/logger'

export const sayHello = () => {
  const date = format(new Date(), 'HH:mm D MMM YYYY')
  serverLogger.info(`[${date}]  Hello!`)
}
