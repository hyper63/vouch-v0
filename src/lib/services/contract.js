
const VOUCH = '_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk'
/**
 * @param {any} warp
 * @param {object} wallet
 * @param {string} address
 * @param {string} transaction
 * @returns {Promise<Boolean>}
 */
export default async function (warp, wallet, address, transaction) {
  const vouchContract = warp.contract(VOUCH)
  return await vouchContract.connect(wallet).writeInteraction({
    function: 'addVouchedUser',
    address,
    transaction
  }).then(
    () => vouchContract.readState())
    .then(
      /**
       * @typedef {Object} ReadStateResults
       * @property {any} cachedValue
       * 
       * @param {ReadStateResults} results
       * @returns {Boolean}
       */
      ({ cachedValue }) => cachedValue.state.vouched[address] ? true : false)
}