import { getMongoClient } from '../mongo'
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
	const { Searchers } = await getMongoClient();
	const data = await Searchers.find();
	let _ids = Array.from(data).map(x=>x._id)

	let max = Math.max(..._ids)

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify({max}));

}