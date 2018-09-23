import {mockDate} from '@jest/mockDate'
import {comingDueDate} from '@shared/dueDate'

it('gets the expected coming due date', () => {
  mockDate('Sept 23 2018')
  comingDueDate()
})
