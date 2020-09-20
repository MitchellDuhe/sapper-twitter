const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

let MONGO_URI = process.env.MONGO_URI;

mongoose.connection.on("open", function(ref) {
  console.log("mongo server connected");
  return start_up();
});

const start_up = ()=>{}    

mongoose.connection.on("error", function(err) {
  console.log("no go on the mongo server :( ");
  return console.log(err);
});

// define Schema
const userDataSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  handle: String,
  followers: Number,
  img_url:String
});

// compile schema to model
const UserData = mongoose.model('UserData', userDataSchema, 'users');

// define Schema
const tweetSchema = new mongoose.Schema({
  _id: Number,
  tweets:[{ 
    tweetId: String,
    tweet:String,
    retweeted:Boolean
  }]
});

// compile schema to model
const Tweets = mongoose.model('Tweets', tweetSchema, 'tweets');

// define Schema
const searcherSchema = new mongoose.Schema({
  _id: Number,
  searches:[String]
});

// compile schema to model
const Searchers = mongoose.model('Searchers', searcherSchema, 'searchers');

let client = null;
export async function getMongoClient(){
  if (!client){    
    client = await mongoose.connect(MONGO_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true
    })
  }
  return {client, UserData, Tweets, Searchers}
}