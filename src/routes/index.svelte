<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch(`UserData.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { users: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let users;
	import { onMount } from 'svelte'
	import Searchbar from './Searchbar.svelte'
	import Plot from './Plot.svelte'
  import { userTweetData } from './userTweetData.js'

	import createAutoComplete from './autoComplete.js';
	import Autocomplete from './Autocomplete.svelte';
	let autoCompleteObject;
	onMount(()=>{
		if (!(users === undefined)){
			retryAutocomplete(0);
		}
	})
	
	let centered=true;
	let user = {handle:'none-selected'};
	let displayedSearch;
	let userInDB;
	let handleRegex = /[^a-zA-Z0-9\_]/g;
	let searchValue;
	let searchError = false;

	function retryAutocomplete(retries){
		setTimeout(()=>{
			autoCompleteObject = createAutoComplete(users)
			if (!autoCompleteObject && retries < 5){
				retryAutocomplete(retries+1)
			}
		},50*retries)
	}


	function decenter(event){
		searchValue = event.detail.handle.replace('@','')
		if (searchValue.length > 16 || handleRegex.test(searchValue)){
			searchError = 'Please enter a valid twitter handle';
			return;
		} 
		user = searchValue.replace(handleRegex,'')
		displayedSearch = event.detail.displayedSearch;
		userInDB = event.detail.userInDB;
		centered = false;
	}

	userTweetData.set({	
		nTweets: 'counting',
		length:0,
		max:0,
		gt1length:0,
		userPic: undefined,
	})
	$: editUserTweetData(displayedSearch)
	function editUserTweetData(displayedSearch){
		userTweetData.set({
			nTweets: 'counting',
			length:0,
			max:0,
			gt1length:0,
			userPic: undefined,	
			// data.nTweets= 'counting';
			// data.length=0;
			// data.max=0;
			// data.gt1length=0;
			// data.userPic= undefined;
		})
	}

	function clearError(){
		searchError = false;
	}
	// let testButton;
	// function handleClick(event){
	// 	autoCompleteObject.dataStream.push({
	// 		name:'autotest',
	// 		followers: 47214228,
	// 		handle: "nytimes",
	// 		img_url: "http://pbs.twimg.com/profile_images/1098244578472280064/gjkVMelR_normal.png",
	// 		_id: 807095
	// 	})
	// 	console.log(autoCompleteObject)
	// }
</script>

<!-- <button 
	bind:this={testButton}
	on:click={handleClick}>test</button> -->
<div class="content">
	<div 
		class:centered
		class:decentered={!centered}
		class="searchbar-container centered">
		<Searchbar 
			on:decenter={decenter} 
			on:clearError={clearError}
			{centered} {searchError}/>
	</div>
	{#if !centered }
		<div class="graph-container">
			<Plot {user} {displayedSearch} {userInDB} {autoCompleteObject}/>
		</div>
	{/if}
</div>

<style>
	.searchbar-container.centered{
		left:50%;
		top:33%;
		transform: translate(-50%,-50%);
	}
	.searchbar-container{
		z-index: 1;
		position:absolute;
		left:50px;
		top:50px;
		transform: none;
		transition:400ms ease-out 0ms;
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@media only screen and (max-width:1400px){
		.decentered.searchbar-container{
			position: relative;
			top:auto;
			left:auto;
		}
	}

</style>