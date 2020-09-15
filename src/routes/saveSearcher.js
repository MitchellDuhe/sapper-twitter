
import { getMongoClient } from '../mongo'

export async function post(req, res, next) {
  /* Initializes */
  res.setHeader('Content-Type', 'application/json')
  /* Retrieves the data */
  const data = req.body
  //user_id, newUser, searchValue

  /* do stuff */
  const { Searchers } = await getMongoClient();

  if (data.newUser){
    try {
      await Searchers.create({
        _id:data.user_id,
        searches:[]
      });
    } catch (err){
      if (err.code === 11000){
        //could be a problem with the creation of new cookies or reading existing cookies. 
        console.log('this cookie id has already been used for a search collection.')
      } else {
        console.log(err)
      }
    }
  }
  let {searchValue} = data;
  let success = true; 
  let update = { $push: { searches: searchValue }};
  try {
    await Searchers.updateOne({_id:data.user_id},update);
  } catch (err) {
    success = false;
    console.log('push to search db failed. ', err)
  }
  
  res.end(JSON.stringify({ success }));
}