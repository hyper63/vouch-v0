import { test, assert } from 'vitest'
import addVouchedUser from './contract'

const warp = {
  contract: () => ({
    connect: () => ({
      writeInteraction: () => Promise.resolve(true)
    }),
    readState: () => Promise.resolve({ cachedValue: { state: { vouched: { '1': true } } } })
  })
}
const wallet = {}
const address = '1'
const transaction = '2'

test('contract add vouch', async () => {
  const result = await addVouchedUser(warp, wallet, address, transaction)
  assert.ok(result)
})