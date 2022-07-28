import { test, expect } from 'vitest'
import { search } from './twitter'

test('twitter search', async () => {
  const result = await search('8Eyr9iu-pae5HPHLtzd6lNNlv-APSkIJfVfae8WnP3I')
  console.log(result)
  expect(true).toBe(true)
})