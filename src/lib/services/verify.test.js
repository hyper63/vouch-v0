import { test, assert } from 'vitest'
import fs from 'fs'
import Arweave from 'arweave'

test('verify signature', async () => {
  const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
  const data = Arweave.utils.stringToBuffer('Hello World')
  const signature = await Arweave.crypto.sign(wallet, data)
  const payload = {
    data: Arweave.utils.bufferTob64Url(data),
    key: wallet.n,
    signature: Arweave.utils.bufferTob64Url(signature)
  }

  const wire = JSON.stringify(payload)
  assert.ok(true)
  const body = JSON.parse(wire)

  // verify

  const result = await Arweave.crypto.verify(
    body.key,
    Arweave.utils.b64UrlToBuffer(body.data),
    Arweave.utils.b64UrlToBuffer(body.signature)
  )

  assert.equal(result, true)

})