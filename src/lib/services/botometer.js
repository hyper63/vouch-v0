import { Botometer } from 'botometer'

const botometer = new Botometer({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_API_KEY,
  accessTokenSecret: process.env.TWITTER_API_SECRET,
  rapidApiKey: process.env.RAPIDAPI_KEY,
  supressLogs: false, // Not required. Defaults to true
  usePro: true,
});

export async function botCheck(username) {


  try {
    const result = await botometer.getScores([username])
    // check days active?
    // 
    const created_at = result[0].user.user_data.created_at
    const daysOld = (new Date().valueOf() - new Date(created_at).valueOf()) / 86400000
    // console.log('Score: ', result[0].display_scores.universal.overall)
    // console.log('Active: ', daysOld)

    //return (result[0].display_scores.universal.overall < 2.6 && daysOld > 14)
    return (daysOld > 14)

  } catch (e) {
    console.log('ERROR: Could not verify twitter handle ' + username)
    console.log(e.message)
    return false
  }
}