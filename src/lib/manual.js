import core from './core'
import Arweave from 'arweave'
import bundlr from './services/bundlr'
import contract from './services/contract'
import { WarpFactory, LoggerFactory, defaultCacheOptions } from 'warp-contracts/mjs'
import fs from 'fs'
import crocks from 'crocks'

/**
 * @typedef { import("crocks/Async/Async")} Async
 * 
 * @typedef { import("crocks/ReaderT")} ReaderT
 */

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true })

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
  return manual(tx).runWith({ wallet, warp, arweave, bundlr, contract }).toPromise()
}


const { ReaderT, Async } = crocks
// @ts-ignore
const AsyncReader = ReaderT(Async)
const { ask, of, lift } = AsyncReader
// @ts-ignore
const { fromPromise, Resolved, Rejected } = Async

/**
 * @typedef {Object} Services
 * @property {any} arweave?
 * @property {any} bundlr?
 * @property {any} wallet?
 * @property {any} warp?
 * @property {any} contract?
 * @property {any} search?
 */

/**
 * @param {any} tx
 * @returns {AsyncReader}
 */
function manual(tx) {
  return of(tx)
    // verify signature
    .chain(verifyAdmin)
    // create new Transaction using Bundlr-Network/Client
    // post transaction using Bundlr-Network/Client
    .chain(dispatch)
    //.map(x => (console.log('dispatch', x), x))
    // get transaction id and then write to VouchDAO
    .chain(addVouchDAO)
  //.map(x => (console.log('verified', x), x))

}

/** 
 * @typedef {object} Data
 * @property {string} address
 * @property {string} transaction
 * 
 * @param {Data} data 
 * @returns {AsyncReader}
 */
function addVouchDAO({ address, transaction }) {
  //console.log({ address, transaction })
  return ask(
    /**
     * @param {Services} services 
     */
    ({ warp, contract, wallet }) => {
      return fromPromise(contract)(warp, wallet, address, transaction)
    }).chain(lift)
}

/**
 * @param {any} data
 * @returns {AsyncReader}
 */
function dispatch(data) {
  return ask(
    /**
     * @param {Services} services
     */
    ({ bundlr }) => {
      return fromPromise(bundlr)(data.address)
        .chain(
          /**
           * @param {any} result
           * @returns {Async}
           */
          result => result.ok ? Resolved({ address: data.address, transaction: result.id }) : Rejected(new Error('Could not dispatch Transaction!')))
    }).chain(lift)
}

/** 
 * @typedef {Object} SignatureInput
 * @property {any} data
 * @property {string} publicKey
 * @property {string} signature
 * 
 * @param {SignatureInput} input
 * @returns {AsyncReader}
 */
function verifyAdmin(tx) {
  const PUBLIC_KEY = "raUmzBSXLPX-G97EjgnPSAVYLbHHVF6yDJsoTGBB6CIl3CzDMULfOH5oAlHCWzQtqQaLq3JipwnD8qPGF4veJgn6_fYa5KRogN3EQpPSwb7akpo3Iutt5z0G8Hem9t3xw6ux6-DCxZL9p7FStMn8-DPrxAmG3Jz8yQP0lZUFDfeIhAds7wW1B0Z46IdTjkYv-JnvKmawR15Izw9M4ywh0FF9GPadGpisdZ1JmBNOfg3dd0y2V4HBa_ZT95H-qWdzo8f4YZPFLEddHlFhuFNZuHeYx8fLVCPziyoe36DM4jd4O1_80RtKWbFpwBWL4vdtuX0qUFSGEG9IQNECtsKLhXQnkYtjST-tJpWSJ8PmXfCeJsb2zxGfq8zZANGGmEcASP8KicxQEAKUd9boOEYDEbh_G37SJsjggxV9c09Wh2v8fW4ANv64F2rKY5FfAMhdDCcYNrYbk0wma9VFK2RWQrV1Am4XejGibrq0ulBSmB1VZDOi_BI_arsdZW9mxvI-FH9huiWhq_5nQ6kFMgkbO1vh09XyqrB2eNrxHYPpk4bEUfQ3TgjW-LKdn_0ERTgNhHamRACdYc7mcfDX3g8T3VfUtyH7Db8t-Fx_Xqj3qIDv2FB2ed1AHqk03YH-uE_Xe5XdZ8qqsJPgrqmXQXEuI7co4jI3SzHa6ewd3AhAHlc"

  /**
   * @param {any} arweave
   * @returns {Async}
   */
  const verify = arweave => fromPromise(arweave.transactions.verify.bind(arweave.transactions))
  return ask(
    /**
     * @param {Services} services 
     * @returns {Async}
     */
    ({ arweave }) => {
      // @ts-ignore
      return verify(arweave)(tx)
        .chain(
          /**
           * @param {Boolean} result
           * @returns {Async}
           */
          result =>
            (result && tx.owner === PUBLIC_KEY)
              ? Resolved(JSON.parse(arweave.utils.bufferToString(tx.data)))
              : Rejected(new Error('Could not verify payload ' + arweave.utils.bufferToString(tx.data)))
        )
    }
  ).chain(lift)
}