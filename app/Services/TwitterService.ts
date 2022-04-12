import Twitter from 'twitter-v2'
import Env from '@ioc:Adonis/Core/Env'
class TwitterService {
  public static async getUser(userName) {
    const client = new Twitter({bearer_token: Env.get('BEARER_TOKEN').toString()})
    const path = 'users/by/username/' + userName.toString()
    const monitoredData:any = await client.get(path)
    return monitoredData?.data?.id
  }

  public static async getUsernameById(monitoredId) {
    const client = new Twitter({bearer_token: Env.get('BEARER_TOKEN').toString()})
    const path = 'users/' + monitoredId.toString()
    const monitoredData:any = await client.get(path)
    return monitoredData.data.username
  }

  public static async getTweets(monitored) {

    const client = new Twitter({bearer_token: Env.get('BEARER_TOKEN').toString()})
    const urlParams = {
      query: 'from:' + monitored.user_name.toString() + ' OR to:' + monitored.user_name.toString(),
      tweet:{
        fields: 'author_id,conversation_id,created_at,in_reply_to_user_id,referenced_tweets'
        },
      since_id: (monitored.last_message_id ? monitored.last_message_id.toString() : null),
    }
    const path = 'tweets/search/recent'
    const tweets:any = await client.get(path, urlParams)

    return tweets
  }
}

export default TwitterService
