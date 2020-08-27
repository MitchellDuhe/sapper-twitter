import { init } from '@lib/mongo'
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

	const { UserData } = await init();

  const data = await UserData.find()//{handle:"BarackObama"})
  
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(data));
}
