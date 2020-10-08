<script>
	import { onMount,createEventDispatcher,tick } from 'svelte'
	const dispatch = createEventDispatcher();
	import Loading from './Loading.svelte'
	// import Wordblock from './Wordblock.svelte'
	import Testblock from './Testblock.svelte'
	import Bar from './Bar.svelte';
	import { userTweetData } from './userTweetData.js'

	//===============
	//     init
	//===============
	
	let loadingText = 'Loading Plot...' 
	let wordCount = [[0,0]];
	let countCount = {};
	let wordBlocks = [];
	let waiting = true;
	export let user;
	export let userInDB;
	export let autoCompleteObject;
	export let mobileDevice;

	function waitX(t){ 
		return new Promise((resolve,reject)=>{
		setTimeout(resolve,t)
		});
	}

	let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	//================
	//		plot dims
	//================
	
	export let plotHeight = 500;
	export let windowWidth;
	let plot;
	let barWidth = 30;
	let barSpace = 10;	
	let plotWidth;
	let fullWordList = true;
	let barsWidth;



	const getPlotWidth = (waiting)=>{
		fullWordList = $userTweetData.length < 100
		let width;
		if (!waiting){
			let barsWidth;
			if (fullWordList){
				barsWidth = $userTweetData.length*( barWidth + barSpace ) + 20;
			} else {
				barsWidth = $userTweetData.gt1length*( barWidth + barSpace ) + 20;
			}
			let blocksWidth = wordBlocks.length*350;
			width = barsWidth + blocksWidth;
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
		let res,resJSON;
		if (userInDB){
			res = await fetch(`user/${user}.json`);
			resJSON = await res.json();
		} else {
			loadingText = 'Finding new user'
			res = await fetch(`finduser/${user}.json`);
			resJSON = await res.json();
		}
		return resJSON
	}
	
	async function getTweets(userId){
		let res,resJSON;
		if (userInDB){
			res = await fetch(`tweets/${userId}.json`);
			resJSON = await res.json();
		} else {
			loadingText = "Finding new user's tweets, this could take a minute depending on the number of recent tweets"
			res = await fetch(`findtweets/${userId}.json`);
			resJSON = await res.json();
		}
		return resJSON
	}

	function cleanTweets(userTweets){
		let tweets = userTweets.tweets
		tweets = tweets.map(tweet=> {
			return tweet.tweet.trim().replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/[^a-z0-9'’]/gmi, " ").replace(/\s+/g, " ").toLowerCase();
		})
		return tweets
	}

	async function countWords(tweets){
		loadingText = 'Counting Words...'
		let wordDict = {} 
		await waitX(100) //remove this
		tweets.forEach(tweet=>{
			tweet.split(' ').forEach(word=>{
				if (word === ' ' || word === '') return
				if (word in wordDict){
					wordDict[word]+=1;
				} else {
					wordDict[word] = 1;
				}
			})
		})
		return wordDict
	}

	//================================================================
	//	     $: calls after wordcount. must be in this order
	//================================================================


	$: editUserTweetData(wordCount)
	function editUserTweetData(wordCount){
		userTweetData.set({	
			nTweets,
			length:wordCount.length,
			max:wordCount[0][1],
			gt1length:wordCount.filter(x=>x[1]>1).length,
			userPic
		})
	}
	let scale; 
	let badscale = true;
	$: badscale = isNaN(scale(wordCount[0][1]));
	export let scaleDims;

	function scaleBars(scaleDims){
		waiting = false;
		return d3.scaleLinear()
			.domain([scaleDims.domain.x,scaleDims.domain.y])
			.range([scaleDims.range.y, scaleDims.range.x]);
			
	}

	$: barsWidth = $userTweetData.length*( barWidth + barSpace ) + 20;

	$: plotWidth = getPlotWidth(waiting)

	$: getUserData(user);
	
	$: scale = scaleBars(scaleDims)
	
	let userPic;
	let nTweets = 'Counting';
	async function getUserData(user) {
		waiting = true;
		try{
			let dbInfo = await getUserDBinfo(user);
			if (!userInDB) addNewSearchToTempMemory(dbInfo);
			if(dbInfo.tooManyRequests){
				loadingText = 'This app has made too many requests to the Twitter API. Please try again later.'
				return 
			} else if (dbInfo.notFound){
				loadingText = 'No user found. Be sure to search by the twitter handle '
				return 
			}
			let userId = dbInfo._id;
			userPic = dbInfo.img_url.replace('http://','https://');
			userTweetData.update(data=>{
				data.userPic = userPic;
				return data
			})
			let userTweets = await getTweets(userId);
			if(userTweets.tooManyRequests){
				loadingText = 'This app has made too many requests to the Twitter API. Please try again later.'
				return 
			} else if (userTweets.noResults || userTweets.tweets.length === 0){
				loadingText = 'No tweets to display. Please try another user.'
				userTweetData.update(data=>{
					data.nTweets = 0;
					return data
				})
				return 
			}
			nTweets = userTweets.tweets.length;
			handleTweets(userTweets);
		} catch (err) {
			console.log(err);
			loadingText = 'Failed to fetch user data. Please try another user.'
		}

		async function handleTweets(userTweets){
			let cleanedTweets = cleanTweets(userTweets);
			let wordDict = await countWords(cleanedTweets);
			countCount = createCountCount(Object.values(wordDict));
			let wordCountFull = Object.entries(wordDict).sort((a,b)=>b[1]-a[1]);
			wordBlocks=[];
			if (wordCountFull.length < 100){
				wordCount = wordCountFull;
				return
			} else if (wordCountFull.length === 0) {
				loadingText = 'No tweets to display. Please try another user.'
				return 
			}
			wordBlocks = createWordBlocks(wordCountFull, countCount)
			wordCount = wordCountFull.filter(word=>word[1]>parseInt(wordBlocks[0][0]))
		}
		function addNewSearchToTempMemory(dbInfo){
				autoCompleteObject.dataStream.push({
				name:dbInfo.name,
				followers: dbInfo.followers,
				handle: dbInfo.handle,
				img_url: dbInfo.img_url,
				_id: dbInfo._id,
			})
		}
	}

	function createCountCount(kvArr) {
		let map = kvArr.reduce(function(obj, b) {
			obj[b] = ++obj[b] || 1;
			return obj;
		}, {});
		return map
	}
	
	function createWordBlocks(wordCount,countCount) {
		wordBlocks = {};
		let firstOverTen = Object.keys(countCount).reverse().find(num=>countCount[num] > 10)
		for (let i=firstOverTen;i>0;i--){
			wordBlocks[i] = []
		}
		wordCount.forEach(word=>{
			if (word[1] in wordBlocks) wordBlocks[word[1]].push(word[0]);
		})
		return Object.entries(wordBlocks).sort((a,b)=>b[0]-a[0]);
	}
</script>

{#if waiting}
	<Loading { loadingText } />
{/if}
<svg class="plot" width={plotWidth} height={plotHeight+32} bind:this={plot}
	xmlns="http://www.w3.org/2000/svg">
	<!-- <p></p> -->
  <defs>
		<linearGradient id="grad3" gradientTransform="rotate(90)">
			<stop offset="0%"/>
      <stop offset="50%"/>
    </linearGradient>
  </defs>
	{#each 	wordCount as word,index} 
		{#if !waiting && !badscale && (word[1] > 1 || fullWordList)}
				<Bar
					unScaledValue={word[1]}
					value={scale(word[1])} 
					{index} 
					text={word[0]}
					{barWidth}
					{barSpace}
					{mobileDevice}
				/>
		{/if}
	{/each}
	{#if !waiting}
		{#each 	wordBlocks as count,index} 
			<Testblock initialOffset={barsWidth + 100} {count} {index} {mobileDevice} {isSafari}/>
		{/each}
	{/if}
</svg>

<style>
	.plot, .plot * {
		user-select: none;
	}

	.plot{
		color:black;
		fill: black;
		border-top-right-radius: 25px;
		border-bottom-right-radius: 25px;
		min-width: 95%;
		transform: rotate(180deg) scaleX(-1);
		color:#333;
		background-color: var(--plot-background);
		padding:0 var(--plot-padding-top) 2rem 0;
		cursor: grab;
	}

	.plot:active{
		cursor: grabbing;
	}

	#grad3 > stop:nth-child(1){
		stop-color:var(--plot-colorful-secondary);
	}
	#grad3 > stop:nth-child(2){
		stop-color:var(--plot-colorful);
	}
	
</style>