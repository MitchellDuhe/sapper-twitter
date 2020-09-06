<script>
	import { onMount,createEventDispatcher,tick } from 'svelte'
	const dispatch = createEventDispatcher();
	import Bar from './Bar.svelte';
	import Loading from './Loading.svelte'
	import WordBlock from './WordBlock.svelte'
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

	function waitX(t){ 
    return new Promise((resolve,reject)=>{
      setTimeout(resolve,t)
    });
	}

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

	const getPlotWidth = (waiting)=>{
		fullWordList = $userTweetData.length < 100
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

	function cleanTweets(userTweets){
		let tweets = userTweets.tweets
		tweets = tweets.map(tweet=> {
			// console.log(tweet.tweet)
			return tweet.tweet.trim().replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/[^a-z0-9'’]/gmi, " ").replace(/\s+/g, " ").toLowerCase();
		})
		return tweets
	}

	const countWords = async (tweets)=>{
		loadingText = 'Counting Words...'
		let wordDict = {} 
		await waitX(100)
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
			length:wordCount.length,
			max:wordCount[0][1],
			gt1length:wordCount.filter(x=>x[1]>1).length
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

	$: plotWidth = getPlotWidth(waiting)

	$: getUserData(user);
	
	$: scale = scaleBars(scaleDims)
	
	async function getUserData(user) {
		try{
			waiting = true;
			let dbInfo = await getUserDBinfo(user);
			let userId = dbInfo._id;
			let userTweets = await getTweets(userId);
			if (userTweets.tweets.length === 0) {
				loadingText = 'No tweets to display. Please try another user.'
				return 
			}
			let cleanedTweets = cleanTweets(userTweets);
			let wordDict = await countWords(cleanedTweets);
			countCount = createCountCount(Object.values(wordDict));
			wordCount = Object.entries(wordDict).sort((a,b)=>b[1]-a[1]);
			wordBlocks = createWordBlocks(wordCount, countCount)
			console.log(wordBlocks)
		} catch (err) {
			console.log(err);
			loadingText = 'Failed to fetch user data. Please try another user.'
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
		Object.keys(countCount).forEach(num=>{
			if (countCount[num] > 10) wordBlocks[num] = [] 
		})
		wordCount.forEach(word=>{
			if (word[1] in wordBlocks) wordBlocks[word[1]].push(word[0]);
		})
		return wordBlocks;
	}


</script>

{#if waiting}
	<Loading { loadingText } />
{:else}
	<p style="visibility:hidden;height:0;position:absolute"></p>
{/if}
<svg class="plot" width={plotWidth} height={plotHeight+32} bind:this={plot}>
	<p></p>
	{#each 	wordCount as word,index} 
		{#if !waiting && !badscale && (word[1] > 1 || fullWordList)}
			{#if countCount[word[1]] < 10}
				<Bar
					unScaledValue={word[1]}
					value={scale(word[1])} 
					{index} 
					text={word[0]}
					final={index === wordCount.length-1} 
					{barWidth}
					{barSpace}/>
			{/if}
		{/if}
	{/each}
	{#each 	wordBlocks as count,index} 
		<WordBlock {count}/>
	{/each}
</svg>

<style>
	svg {
		color:black;
		fill: black;
		border-top-right-radius: 25px;
		border-bottom-right-radius: 25px;
		min-width: 95%;
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