<script>
	import { onMount,createEventDispatcher,tick } from 'svelte'
	const dispatch = createEventDispatcher();
	import FollowersBar from './FollowersBar.svelte';
	import Loading from './Loading.svelte'
	import { userTweetData } from './userTweetData.js'

	//===============
	//     init
	//===============
	let loadingText = 'Loading Plot...' 

	let userTweets = [];
	let wordCount = [[0,0]];
	let waiting = true;
	let userId;
	let tweets;	
	let dbInfo;
	export let user;
	onMount(async ()=>{
		dbInfo = await getUserDBinfo(user);
		userId = dbInfo._id;
		userTweets = await getTweets(userId);
		wordCount = await countWords(userTweets)
		waiting = false;
		console.log(wordCount)
	})

	//================
	//		plot dims
	//================
	
	export let plotHeight = 500;
	export let windowWidth;
	let plot;
	let barWidth = 30;
	let barSpace = 10;	
	let plotWidth;

	$: fullWordList = $userTweetData.length < 100
	const getPlotWidth = (waiting)=>{
		let width
		if (!waiting){
			if (fullWordList){
				width = $userTweetData.length*( barWidth + barSpace ) + 20;
			} else {
				width = $userTweetData.gt1length*( barWidth + barSpace ) + 20;
			}
			dispatch('plotWidthChange')
		} else {
			width = (windowWidth/2)-16 //adjusted for rem offset. Border box sizing messes up other padding
		}
		return width
	}

	//================
	//	handletweets
	//================
	async function getUserDBinfo(user){
    const res = await fetch(`user/${user}.json`);
		const resJSON = await res.json();
		return resJSON
	}
	
	async function getTweets(userId){
    const res = await fetch(`tweets/${userId}.json`);
		const resJSON = await res.json();
		return resJSON
	}

	function waitX(t){ 
    return new Promise((resolve,reject)=>{
      setTimeout(resolve,t)
    });
	}

	const getUserTweets = async (user)=>{
		let tweetsText = []
		loadingText = 'Getting Tweets...'
		await waitX(50)
		// the broccoli 
		// user.tweets.forEach(id=>{
		// 	let matches =  $tweets.filter(x=>x._id.toString().indexOf(id.slice(1,14))>-1)
		// 	if (matches.length > 1) {
		// 		console.log ("similar tweet ID")
		// 	} else if (matches.length === 0) {
		// 		console.log('no match, ', id)
		// 		return
		// 	}
		// 	tweetsText.push(matches[0].text)
		// })
		return tweetsText
	}	
	
	const countWords = async (userTweets)=>{
		loadingText = 'Counting Words...'
		let wordDict = {} 
		let tweets = userTweets.tweets
		await waitX(100)
		tweets.forEach(tweetData=>{
			let tweet = tweetData.tweet
			tweet.split(' ').forEach(word=>{
				if (word in wordDict){
					wordDict[word]+=1;
				} else {
					wordDict[word] = 1;
				}
			})
		})
		return Object.entries(wordDict).sort((a,b)=>b[1]-a[1])
	}

	//================================================================
	//	     $: calls after wordcount. must be in this order
	//================================================================


	$: editUserTweetData(wordCount)
	function editUserTweetData(wordCount){
		userTweetData.set({	
			length:wordCount.length,
			max:wordCount[0][1],
			gt1length:wordCount.filter(x=>x[1]>1).length
		})
	}
	let scale; 
	$: scale = scaleYaxis($userTweetData)
	
	function scaleYaxis(data){
		let ymax;
		if (data.max > 5){
			ymax = Math.round(data.max/10)*10;
		} else {
			ymax = data.max;
		}
		d3.scaleLinear()
			.domain([0,ymax])
			.range([0, plotHeight-32]);
	}

	$: plotWidth = getPlotWidth(waiting)

</script>

{#if waiting}
	<Loading { loadingText } />
{:else}
	<p style="visibility:hidden;height:0;position:absolute"></p>
{/if}
<svg class="plot" width={plotWidth} height={plotHeight+32} bind:this={plot}>
	<p></p>
	{#each 	wordCount as word,index} 
		{#if (word[1] > 1 || fullWordList)}
			<FollowersBar 
				value={scale(word[1])} 
				{index} 
				text={word[0]}
				final={index === wordCount.length-1} 
				{barWidth}
				{barSpace}/>
		{/if}
	{/each}
</svg>

<style>
	svg {
		color:black;
		fill: black;
		border-top-right-radius: 25px;
    	border-bottom-right-radius: 25px;
	}

	.plot, .plot * {
		user-select: none;
	}

	.plot{
		transform: rotate(180deg) scaleX(-1);
		color:#333;
		background-color: beige;
		padding:0 1rem 2rem 0;
		cursor: grab;
	}

	.plot:active{
		cursor: grabbing;
	}

</style>