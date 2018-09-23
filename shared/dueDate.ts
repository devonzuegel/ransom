import * as DateFns from 'date-fns'

export const comingDueDate = (date: Date) => {
  const weekfromNow = DateFns.addWeeks(date, 1)
  return DateFns.startOfWeek(weekfromNow)
  // return DateFns.subSeconds(DateFns.startOfWeek(weekfromNow), 1)
}
