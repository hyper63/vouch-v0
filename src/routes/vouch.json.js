import vouch from '$lib/vouch'

export async function POST(event) {
  try {
    console.log('Got Signed Request!')
    const body = await event.request.json()
    const result = await vouch(body)
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