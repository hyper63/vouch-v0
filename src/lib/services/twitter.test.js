import { test, assert } from 'vitest'
import { search } from './twitter'

test.skip('twitter search', async () => {
  const result = await search('grpPcgIh95eDYjByE6OYbB_o8QQYcgOJYdexUDcGXik').catch(x => x)
  assert.equal(result, true)
})