import { getMongoClient } from '../../mongo'

const axios = require('axios');

const headers = {
  'Authorization': process.env.TWITTER_BEARER_TOKEN, 
  'Cookie': process.env.TWITTER_COOKIE
}

export async function get(req, res) {
  const {slug} = req.params;
  let response;
  const screen_name = slug;
  let url = `https://api.twitter.com/1.1/users/show.json?screen_name=${screen_name}&include_entities=false`
  let config = {method: 'get',url,headers};
  
  try {
    response = await axios(config)
  } catch(err) { 
    console.log(err)
    if (err.response.status === 429){
      res.end(JSON.stringify({tooManyRequests:true}));
    } else if (err.response.status === 404){
      res.end(JSON.stringify({notFound:true}));
    } 
    res.end(JSON.stringify({failure:true}));
    return 
  }
  //not sure if I ahould have any error handling here
  // if (response.status === 429){ //too many requests 
  //   res.end(JSON.stringify({tooManyRequests:true}));
  // } else if (response.status === 404){
  //   console.log('no user found')
  //   res.end(JSON.stringify({notFound:true}));
  // } else 
  if (response.status !== 200){
    console.log('got a non 200 reponse: ', response)
    res.end(JSON.stringify({failure:true}));
  }
  // console.log(response.data)
    
  let filter = {handle:screen_name}
  let data = { 
    _id: response.data.id,
    name: response.data.name,
    handle: response.data.screen_name, 
    followers: response.data.followers_count,
    img_url:response.data.profile_image_url
  }
  
  const { UserData,Tweets } = await getMongoClient();
  try{
    await UserData.create(data);
  } catch(err) {
    console.log(err)
  }
  try { 
    await Tweets.create({ 
      _id:data._id,
      tweets:[]
    });
  } catch(err) {
    if (err.code === 11000){
      console.log('duplicate key in tweets')
    } else {
      console.log(err)
    }
  }
	
	if (data === undefined){
		res.end({failure:true});
	} else {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
		res.end(JSON.stringify(data));
	}
}