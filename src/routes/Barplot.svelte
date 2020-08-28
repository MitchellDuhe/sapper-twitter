<script>
	import { onMount,createEventDispatcher,tick } from 'svelte'
	// import { peopleData } from '../public/db/stores.js'
	// import { userTweetData } from '../public/db/userTweetData.js'
	// import { tweets } from '../public/db/tweets.js'
	// import { users } from '../public/db/users.js'
	import FollowersBar from './FollowersBar.svelte';
	import Loading from './Loading.svelte'
	let barWidth = 30;
	let barSpace = 10;
	export let plotHeight = 500;
	let plot;

	const dispatch = createEventDispatcher();
	
	$: userTweetData.set({	
		length:wordCount.length,
		max:wordCount[0][1],
		gt1length:wordCount.filter(x=>x[1]>1).length
	})

	$: scale  = d3.scaleLinear()
								.domain([0,Math.round($userTweetData.max/10)*10])
								.range([0, plotHeight-32]);

	const getUserTweets = async (user)=>{
		let tweetsText = []
		loadingText = 'Getting Tweets...'
		await waitX(50)
		user.tweets.forEach(id=>{
			let matches =  $tweets.filter(x=>x._id.toString().indexOf(id.slice(1,14))>-1)
			if (matches.length > 1) {
				console.log ("similar tweet ID")
			} else if (matches.length === 0) {
				console.log('no match, ', id)
				return
			}
			tweetsText.push(matches[0].text)
		})
		return tweetsText
	}	

  function waitX(t){ 
    return new Promise((resolve,reject)=>{
      setTimeout(resolve,t)
    });
	}
	
	const countWords = async (tweets)=>{
		let wordDict = {} 
		loadingText = 'Counting Words...'
		await waitX(100)
		tweets.forEach(tweet=>{
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
	export let handleName;
	let user = $users.find(x=>x.handle===handleName);
	let userTweets = [];
	let wordCount = [[0,0]];
	let waiting = true;
	onMount(async ()=>{
		userTweets = await getUserTweets(user);
		wordCount = await countWords(userTweets);	
		// console.log(wordCount)
		waiting = false;
	})
	
	export let windowWidth;
	const getPlotWidth = (waiting)=>{
		let width
		if (!waiting){
			width = $userTweetData.gt1length*( barWidth + barSpace ) + 20;
			dispatch('plotWidthChange')
		} else {
			width = (windowWidth/2)-16 //adjusted for rem offset. Border box sizing messes up other padding
		}
		return width
	}

	let plotWidth;
	$: plotWidth = getPlotWidth(waiting)
	let loadingText = 'Loading Plot...'
	//plotwidth 39020 not bad 
	//plotwidth 392420 too long
	//maybe split each plot and lazy load or just put all one word usages another way.  
</script>

{#if waiting}
	<Loading { loadingText } />
{:else}
<p style="visibility:hidden;height:0;position:absolute"></p>
{/if}
<svg class="plot" width={plotWidth} height={plotHeight+32} bind:this={plot}>
	<p></p>
	{#each 	wordCount as word,index} 
		{#if word[1] > 1}
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
		/* width:50vw; */
	}

	.plot:active{
		cursor: grabbing;
	}




</style>
