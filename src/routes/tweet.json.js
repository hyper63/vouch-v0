import { check } from '$lib/vouch'

export async function GET(event) {
  try {
    if (!event.url.searchParams.get('addr')) {
      return {
        status: 404,
        body: { message: 'addr query param is not found in request!' }
      }
    }
    const result = await check(event.url.searchParams.get('addr'))
    console.log(result)
    return {
      body: result
    }
  } catch (e) {
    console.log(e.message)
    return {
      status: 500,
      body: { message: 'Error trying to check tweet' }
    }
  }
}