import vouch from '$lib/vouch'

export async function POST(event) {
  try {
    const body = await event.request.json()
    console.log(body)
    //const result = await vouch(body)
    console.log(result)
    return {
      body: { result }
    }
  } catch (e) {
    return {
      status: 500,
      body: { message: 'Error trying to process vouch request!' }
    }
  }
}