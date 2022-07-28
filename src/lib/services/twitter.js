const BEARER = import.meta.env.TWITTER_BEARER
const API = 'https://api.twitter.com/2/tweets/search/recent'

export function search(txt) {
  return fetch(API + `?query=${txt}`, {
    headers: {
      Authorization: `Bearer ${BEARER}`
    }
  }).then(res => res.ok ? res.json() : res)
    .then((result) =>
      (result.data[0].text === `I am vouching for my wallet address ${txt}  🐘 via twitter!`)
        ? true : false
    )
}