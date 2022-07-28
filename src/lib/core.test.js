import { test, expect } from 'vitest'
import core from './core'
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const search = address => Promise.resolve(true)
const bundlr = address => Promise.resolve({ ok: true, id: '1234' })

test('core test', async () => {
  const w = await arweave.wallets.generate()
  const tx = await arweave.createTransaction({
    data: JSON.stringify({
      type: 'vouch',
      service: 'twitter',
      address: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'
    })
  })
  await arweave.transactions.sign(tx, w)
  console.log(JSON.stringify(tx))
  try {
    const result = await core(tx).runWith({ arweave, search, bundlr }).toPromise()
    expect(true).toBe(true)
  } catch (e) {
    console.log('Error:', e.message)
    expect(true).toBe(false)
  }
})