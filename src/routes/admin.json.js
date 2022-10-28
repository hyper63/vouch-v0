import manual from '$lib/manual'
import Arweave from 'arweave'
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

export async function POST(event) {
  try {
    console.log('Got Signed Request!')
    const body = await event.request.json()
    body.data = arweave.utils.b64UrlToString(body.data)
    const tx = await arweave.createTransaction(body)
    const result = await manual(tx)
    console.log('success!')
    return {
      body: result ? { ok: true } : { ok: false }
    }
  } catch (e) {
    console.log(e.message)
    return {
      status: 500,
      body: { message: 'Error trying to process vouch request!' }
    }
  }
}