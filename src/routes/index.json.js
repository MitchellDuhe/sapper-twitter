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
	// console.log(user data attempted)
	const { UserData } = await init();

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

// const validJSON = (text)=>{
// 	try {
// 		return  (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
// 		replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
// 		replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
// 	} catch (err) {
// 		return false
// 	}
// }
