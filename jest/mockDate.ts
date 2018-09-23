const RealDate = Date

export function mockDate(mockValue: string) {
  global.Date = jest.fn(() => new RealDate(mockValue)) as any
  Object.assign(Date, RealDate)
  afterEach(() => (global.Date = RealDate)) // Unmock at the end of each test
}
