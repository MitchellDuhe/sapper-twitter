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
	import Graph from './Graph.svelte'
	import Plot from './Plot.svelte'

	import createAutoComplete from './autoComplete.js';
	onMount(()=>{
		if (!(users === undefined)){
			createAutoComplete(users)
		}
	})
	let centered=true;
	let user = {handle:'none-selected'};
	let picture;
	let displayedSearch;
	function decenter(event){
		centered = false;
		user = event.detail.handle;
		displayedSearch = event.detail.displayedSearch;
	}
</script>
<!-- <Loading2/> -->
<div class="content">
	<div 
		class:centered
		class:decentered={!centered}
		class="searchbar-container centered">
		<Searchbar on:decenter={decenter} {centered}/>
	</div>
	{#if !centered }
		<div class="graph-container">
			<Plot {user} {picture} {displayedSearch}/>
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