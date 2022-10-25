import Bundlr from '@bundlr-network/client'
import fs from 'fs'
import contract from '../src/lib/services/contract.js'
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs'

// manually vouch a user
const address = 'SWtLEypwTb6fXbpJDAPIdsWKniwsyCUim8rii6BjQVU'

let walletFile = './wallet.json'

const wallet = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))


const warp = WarpFactory.forMainnet()

const result = await post(address)
const result2 = await contract(warp, wallet, address, result.id)

console.log(result2)


async function post(address) {

  const bundlr = new Bundlr.default('https://node2.bundlr.network', 'arweave', wallet)

  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'Vouch' },
    { name: 'App-Version', value: '0.1' },
    { name: 'Verification-Method', value: 'Twitter' },
    { name: 'Vouch-For', value: address.toString() }
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