/**
 * this is a script file that will query all of the vouched records and read the state of vouchDAO,
 * then diff the two groups, and with the diff group, and create writeInteractions with addVouchedUser.
 */
import { filter, find, map, path, prop, take } from 'ramda'
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
  console.log('vouchUsers: ', vouchUsers.length)
  let vouchForUsers = []

  for await (const x of getVouchForTransactions()) {
    vouchForUsers = vouchForUsers.concat(x)
  }

  // diff arrays
  vouchForUsers = filter(v => !vouchUsers.includes(v.address), vouchForUsers)
  console.log('count: ', vouchForUsers.length)
  // map over diffs
  // for (const v of vouchForUsers) {
  //   await warp.contract(VOUCH).connect(wallet).writeInteraction({
  //     function: 'addVouchedUser',
  //     address: v.address,
  //     transaction: v.transaction
  //   })
  // }
}

main().catch(e => console.log(e))


async function* getVouchForTransactions() {
  let c = null
  let count = 100
  while (count === 100) {
    const query = `
query {
  transactions(
    first: 100, 
    owners: "Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8", 
    tags: {name: "App-Name", values: "Vouch"}
    ${c ? `, after: "${c}"` : ''}
    ) {
    edges {
      cursor
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
    const edges = path(['data', 'data', 'transactions', 'edges'], result)
    //console.log('nodes: ', nodes.length)
    count = edges.length
    c = edges[edges.length - 1].cursor

    yield map(({ cursor, node }) => ({
      transaction: node.id,
      address: prop('value', find(t => t.name === 'Vouch-For', node.tags)),
      cursor
    }), edges)
  }
}
