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
const warp = {
  contract: () => ({
    connect: () => ({
      writeInteraction: () => Promise.resolve(true)
    }),
    readState: () => Promise.resolve({ cachedValue: { state: { vouched: { '1': true } } } })
  })
}
const wallet = {}
const contract = () => Promise.resolve(true)

test('core test', async () => {
  const w = await arweave.wallets.generate()
  const address = await arweave.wallets.jwkToAddress(w)
  const data = Arweave.utils.stringToBuffer(
    JSON.stringify({
      address,
      service: 'twitter',
      type: 'vouch'
    })
  );
  const signature = await Arweave.crypto.sign(w, data);
  //console.log(JSON.stringify(tx, null, 2))

  try {
    const result = await core({ data: arweave.utils.bufferTob64Url(data), publicKey: w.n, signature: Arweave.utils.bufferTob64Url(signature) }).runWith({ arweave, search, bundlr, warp, wallet, contract }).toPromise()
    expect(true).toBe(true)
  } catch (e) {
    console.log('Error:', e.message)
    expect(true).toBe(false)
  }
})