import * as format from 'date-fns/format'

export const sayHello = () => {
  const date = format(new Date(), 'HH:mm D MMM YYYY')
  console.log(`[${date}]  Hello!`)
}
