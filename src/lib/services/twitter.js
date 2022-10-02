import { botCheck } from './botometer.js'

const BEARER = process.env.TWITTER_BEARER
const API = 'https://api.twitter.com/2/tweets/search/recent'
const API2 = 'https://api.twitter.com/2/users'

export function search(txt) {
  console.log(txt)
  console.log(BEARER)
  return fetch(API + `?query=${txt}&tweet.fields=author_id`, {
    headers: {
      Authorization: `Bearer ${BEARER}`
    }
  }).then(res => res.ok ? res.json() : res.text())
    .then((result) =>
      (result.data && result.data[0].text === `I am vouching for my wallet address ${txt}  🐘 via @vouchdao!`)
        ? result.data[0].author_id
        : Promise.reject(new Error('Could not find Tweet!'))
    )
    .then(author_id => fetch(API2 + `/${author_id}`, {
      headers: {
        Authorization: `Bearer ${BEARER}`
      }
    }))
    .then(res => res.ok ? res.json() : res.text())
    .then(({ data }) => botCheck(`@${data.username}`))
}