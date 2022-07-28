import Bundlr from '@bundlr-network/client'

const wallet = JSON.parse(import.meta.env.JWK)

export default async function (address) {
  const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', wallet)
  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'Vouch' },
    { name: 'App-Version', value: '0.0.0' },
    { name: 'Vouch-Address', value: address }
  ]

  const data = JSON.stringify({
    address,
    name: 'Vouch',
    type: 'twitter'
  })

  const tx = bundlr.createTransaction(data, { tags })
  await tx.sign()
  const result = await tx.upload()
  return result.data
}