import { WarpFactory, LoggerFactory } from 'warp-contracts/web'
import fs from 'fs'

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()
const VOUCH = '_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk'
/**
 * @param {string} address
 * @param {string} transaction
 */
export default async function (address, transaction) {
  let walletFile = './wallet.json'
  if (import.meta.env.PROD) {
    walletFile = '/etc/secrets/wallet.json'
  }
  const wallet = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))
  return await warp.contract(VOUCH).connect(wallet).writeInteraction({
    function: 'addVouchedUser',
    address,
    transaction
  })
}