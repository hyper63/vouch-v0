import crocks from 'crocks'
/**
 * @typedef { import("crocks/Async/Async")} Async
 * 
 * @typedef { import("crocks/ReaderT")} ReaderT
 */

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
export default function (tx) {
  return of(tx)
    // verify signature
    .chain(verifySignature2)
    // wait 60 seconds for tweet to appear
    .chain((x) => ask(() => fromPromise(() => new Promise(resolve => {
      //if (import.meta.env.PROD) {
      setTimeout(() => resolve(x), 60 * 1000)
      //} else {
      //  resolve(x)
      //}
    }))()).chain(lift))
    // search for tweet
    // validate tweet results
    .chain(searchTwitter)
    // create new Transaction using Bundlr-Network/Client
    // post transaction using Bundlr-Network/Client
    .chain(dispatch)
    // get transaction id and then write to VouchDAO
    .chain(addVouchDAO)

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
 * @param {any} data
 * @returns {AsyncReader}
 */
function searchTwitter(data) {
  return ask(
    /**
     * @param {Services} services
     */
    ({ search }) => {
      return fromPromise(search)(data.address)
        .chain(
          /**
           * @param {Boolean} result
           * @returns {Async}
           */
          result => result ? Resolved(data) : Rejected(new Error('Could not find tweet!')))
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
function verifySignature2({ data, publicKey, signature }) {

  /**
   * @param {any} arweave
   * @returns {Async}
   */
  const verify = arweave => fromPromise(arweave.crypto.verify.bind(arweave.crypto))
  return ask(
    /**
     * @param {Services} services 
     * @returns {Async}
     */
    ({ arweave }) =>
      // @ts-ignore
      verify(arweave)(publicKey, arweave.utils.b64UrlToBuffer(data), arweave.utils.b64UrlToBuffer(signature))
        .chain(
          /**
           * @param {Boolean} result
           * @returns {Async}
           */
          result => result
            ? Resolved(JSON.parse(arweave.utils.b64UrlToString(data)))
            : Rejected(new Error('Could not veify payload ' + data))
        )
  ).chain(lift)
}