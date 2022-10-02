import core from './core'
import Arweave from 'arweave'
import bundlr from './services/bundlr'
import { search } from './services/twitter'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

export default function (tx) {
  return core(tx).runWith({ arweave, search, bundlr }).toPromise()
}

export async function check(addr) {
  return search(addr)
}