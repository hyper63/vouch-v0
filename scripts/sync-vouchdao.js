/**
 * this is a script file that will query all of the vouched records and read the state of vouchDAO,
 * then diff the two groups, and with the diff group, and create writeInteractions with addVouchedUser.
 */
const { WarpFactory, LoggerFactory } = require('warp-contracts')
const Arweave = require('arweave')
const arweave = Arweave.init({ host: 'arweave.net', host: 443, protocol: 'https' })
const warp = WarpFactory.forMainnet()


async function main() {

}

main()
