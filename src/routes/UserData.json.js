import { getMongoClient } from '@lib/mongo'
// const contents = JSON.stringify(posts.map(post => {
// 	console.log('contents created')
// 	return {
// 		title: post.title,
// 		swig: post.slug,
// 		test:'test'
// 	};
// }));
// console.log(contents)
export async function get(req, res) {
	const { UserData } = await getMongoClient();
	const data = await UserData.find();
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	
	if (data === undefined){
		res.end({failure:true});
	} else {
		res.end(JSON.stringify(data));
	}
}