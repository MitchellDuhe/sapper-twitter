<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`index.json`).then(r => r.json()).then(posts => {
			return { posts };
		}).catch((err)=>{
			console.log(err)
		});
	}
</script>

<script>
	export let posts;
	
	import { onMount } from 'svelte'
	import Searchbar from './Searchbar.svelte'
	import Graph from './Graph.svelte'
	import createAutoComplete from './autoComplete.js';
	onMount(()=>{
		if (!(posts === undefined)){
			createAutoComplete(posts)
		}
	})
	let centered=true;
	function decenter(){
		centered = false;
	}
</script>

<div class="content">
	<div 
		class:centered
		class="searchbar-container centered">
		<!-- <p></p> -->
		<Searchbar on:decenter={decenter} {centered}/>
	</div>
	{#if !centered}
		<div class="graph-container">
			<Graph />
		</div>
	{/if}
</div>

<style>

	.graph-container{
		background-color: black;
	}
	.searchbar-container.centered{
		left:50%;
		top:33%;
		transform: translate(-50%,-50%);
	}
	.searchbar-container{
		position:absolute;
		left:50px;
		top:50px;
		transform: none;
		transition:400ms ease-out 0ms;
	}

	.content{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>