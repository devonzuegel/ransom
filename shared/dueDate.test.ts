// import * as DateFns from 'date-fns'
import {comingDueDate} from '@shared/dueDate'

it('gets the expected coming due date', () => {
  // Sept 21 was a Friday
  const mockCurrentDate = new Date('Sept 21 2018 00:00 PDT')

  // Note that the mockCurrentDate is in PDT, not UTC or PST, so it's UTC+7.
  expect(mockCurrentDate).toEqual(new Date('Sept 21 2018 07:00 UTC'))

  // On that date (Sept 21), the next due date was Sun 23 Sept
  const result = comingDueDate(mockCurrentDate)

  expect(result.toLocaleString()).toEqual('2018-9-23 00:00:00')
  expect(result).toEqual(new Date('Sept 23 2018 00:00 PDT'))
  expect(result).toEqual(new Date('Sept 23 2018 07:00 UTC'))
})
