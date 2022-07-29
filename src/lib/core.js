import { ReaderT, Async } from 'crocks'

const AsyncReader = ReaderT(Async)
const { ask, of, lift } = AsyncReader

export default function (tx) {
  return of(tx)
    // verify signature
    .chain(verifySignature)
    // search for tweet
    // validate tweet results
    .chain(searchTwitter)
    // create new Transaction using Bundlr-Network/Client
    // post transaction using Bundlr-Network/Client
    .chain(dispatch)

}

function dispatch(tx) {
  return ask(({ arweave, bundlr }) => {
    const data = JSON.parse(arweave.utils.bufferToString(arweave.utils.b64UrlToBuffer(tx.data)))
    return Async.fromPromise(bundlr)(data.address)
      .chain(result => result.ok ? Async.Resolved(result) : Async.Rejected(new Error('Could not dispatch Transaction!')))
  }).chain(lift)
}

function searchTwitter(tx) {
  //const getAddress = (arweave) => Async.fromPromise(arweave.wallets.jwkToAddress.bind(arweave.wallets))
  return ask(({ arweave, search }) => {
    const data = JSON.parse(arweave.utils.bufferToString(arweave.utils.b64UrlToBuffer(tx.data)))
    return Async.fromPromise(search)(data.address)
      .chain(result => result ? Async.Resolved(tx) : Async.Rejected(new Error('Could not find tweet!')))
  }).chain(lift)
}

function verifySignature(tx) {
  const arweaveVerify = (arweave) => Async.fromPromise(arweave.transactions.verify.bind(arweave.transactions))
  const createTransaction = (arweave) => Async.fromPromise(arweave.createTransaction.bind(arweave))

  return ask(({ arweave }) =>
    Async.of(tx)
      .map(x => {
        return { data: arweave.utils.bufferToString(arweave.utils.b64UrlToBuffer(x.data)) }
      })
      .map(x => (console.log('data', x.data), x))
      .chain(createTransaction(arweave))
      .map(newTx => {
        newTx.owner = tx.owner
        newTx.id = tx.id
        newTx.signature = tx.signature
        return newTx
      })
      .chain(arweaveVerify(arweave))
      .chain(result => result ? Async.Resolved(tx) : Async.Rejected(new Error('Could not verify transaction.')))
  ).chain(lift)
}

function searchText(address) {
  return `I am using twitter to vouch for my Arweave Wallet: ${address}`
}