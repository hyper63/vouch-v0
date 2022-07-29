import Bundlr from '@bundlr-network/client'
import fs from 'fs'

export default async function (address) {

  const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
  const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', wallet)

  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'Vouch' },
    { name: 'App-Version', value: '0.0.0' },
    { name: 'Vouch-Address', value: address.toString() }
  ]

  const data = JSON.stringify({
    address: address.toString(),
    service: 'Twitter',
    type: 'Vouch'
  })

  const tx = bundlr.createTransaction(data, { tags })
  await tx.sign()

  const result = await tx.upload()
  return { ok: true, id: result.data.id }
}