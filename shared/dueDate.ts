import * as DateFns from 'date-fns'

export const comingDueDate = () => {
  const weekfromNow = DateFns.addWeeks(new Date(), 1)
  return DateFns.subSeconds(DateFns.startOfWeek(weekfromNow), 1)
}
