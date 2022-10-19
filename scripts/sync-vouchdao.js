/**
 * this is a script file that will query all of the vouched records and read the state of vouchDAO,
 * then diff the two groups, and with the diff group, and create writeInteractions with addVouchedUser.
 */
import { find, map, path, pluck, prop } from 'ramda'
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs'
import Arweave from 'arweave'
import fs from 'fs'

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()

const VOUCH = '_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk'

async function main() {
  const { cachedValue } = await warp.contract(VOUCH).readState()
  const vouchUsers = Object.keys(cachedValue.state.vouched)
  console.log('vouchUsers: ', vouchUsers)
  const vouchForUsers = await getVouchForTransactions()

  console.log('vouchFor: ', vouchForUsers)
  console.log('count: ', vouchForUsers.length)
  // diff arrays
  console.log(vouchForUsers[0])
  // map over diffs
  const res = await warp.contract(VOUCH).connect(wallet).writeInteraction({
    function: 'addVouchedUser',
    ...vouchForUsers[0]
  })
  console.log(res)
}

main().catch(e => console.log(e))


async function getVouchForTransactions() {
  const query = `
query {
  transactions(first: 100, owners: "Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8", tags: {name: "App-Name", values: "Vouch"}) {
    edges {
      node {
        id
        tags {
          name 
          value
        }
      }
    }
  }
}
   `
  const result = await arweave.api.post('graphql', { query })
  console.log(result)
  const nodes = pluck('node', path(['data', 'data', 'transactions', 'edges'], result))
  console.log('nodes: ', nodes.length)
  return map(n => ({
    transaction: n.id,
    address: prop('value', find(t => t.name === 'Vouch-For', n.tags))
  }), nodes)
}
