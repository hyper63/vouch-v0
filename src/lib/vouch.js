import core from './core'
import Arweave from 'arweave'
import bundlr from './services/bundlr'
import contract from './services/contract'
import { search } from './services/twitter'
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs'
import fs from 'fs'

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

let walletFile = './wallet.json'
if (import.meta.env.PROD) {
  walletFile = '/etc/secrets/wallet.json'
}
const wallet = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))


export default function (tx) {
  return core(tx).runWith({ wallet, warp, arweave, search, bundlr, contract }).toPromise()
}

export async function check(addr) {
  return search(addr)
}