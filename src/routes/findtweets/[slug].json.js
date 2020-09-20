import { getMongoClient } from '../../mongo'

const axios = require('axios');

const headers = {
  'Authorization': process.env.TWITTER_BEARER_TOKEN, 
  'Cookie': process.env.TWITTER_COOKIE
}

export async function get(req,res){
  const {slug} = req.params;
  const userId = slug;
  const max_results = 100 ;
  let url = `https://api.twitter.com/2/tweets/search/recent?query=from:${userId}&max_results=${max_results}&tweet.fields=referenced_tweets`
  // to check retweets => `https://api.twitter.com/2/tweets?ids=${idList.join(',')}`  
  let config = {
    method: 'get',
    url,
    headers
  };
  let next_token = true;//initial token unused but cant be undefined. 
  let allTweets = [];
  const { Tweets } = await getMongoClient();
  while (next_token !== undefined){
    let response,status;
    try {
      response = await axios(config)
      status = response.status
    } catch(err) { 
      console.log(err)
      status = err.response.status;
    } 
    if (response.status === 429){ //too many requests 
      res.end(JSON.stringify({tooManyRequests:true}));
    } else if (status !== 200){
      console.log(response)
      res.end(JSON.stringify({failure:true}));
    }
    
    // console.log(data)
    let data = response.data.data;
    
    if (response.data.meta.result_count === 0){
      break
    } else if (data === undefined){
      console.log(response.data)
      break
    }
    
    let filter = { _id:userId };

    let user = await Tweets.findOne(filter)
    let tweetIds= user.tweets.map(x=>x.tweetId)
    for(let j=0;j<data.length;j++){
      let entry = data[j];
      let tweetId = entry.id
      if (tweetIds.indexOf(tweetId) > -1) {
        break
      }

      let retweeted = entry.referenced_tweets;
      if (retweeted) {
        retweeted = (retweeted[0].type === "retweeted")
      } else {
        retweeted = false;
      }
      let tweets = {
        tweetId,
        tweet:entry.text,
        retweeted
      }
      let update = { $push: { tweets }};
      allTweets.push(tweets)
      try {
        await Tweets.updateOne(filter,update);
      } catch (err) {
        console.log(err)
      }
    }
    next_token = response.data.meta.next_token;
    config.url = `https://api.twitter.com/2/tweets/search/recent?query=from:${userId}&max_results=${max_results}&next_token=${next_token}`;
  }
  console.log('all new tweets added ', userId)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({
    _id:userId,
    tweets:allTweets
  }));
}
