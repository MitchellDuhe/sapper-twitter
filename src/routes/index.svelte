<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`index.json`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>

<script>
	export let posts;
	
	import { onMount } from 'svelte'
	import Searchbar from './Searchbar.svelte'
	import Graph from './Graph.svelte'
	// import autoComplete from '../../static/autoComplete';
	let centered=true;
	function decenter(){
		centered = false;
	}
	onMount(()=>{
		const autoCompletejs = new autoComplete({
			data: {
				src: posts,
				key: ["name", "handle"],
			},
			sort: function (a, b) {
				if (a.match < b.match) {
					return -1;
				}
				if (a.match > b.match) {
					return 1;
				}
				return 0;
			},
			query: {
				manipulate: function (query) {
					return query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				},
			},
			trigger: {
				event: ["input","focusin", "focusout"],
				condition: function (query) {
					return !!query.replace(/ /g, "").length && query !== "hamburger";
				},
			},
			placeHolder: "Type Here",
			selector: "#autoComplete",
			debounce: 0,
			searchEngine: "strict",
			highlight: true,
			maxResults: 10,
			resultsList: {
				render: false,
				container: null,//function (source) {source.setAttribute("id", "autoComplete_list");},
				element: "ul",
				destination: document.querySelector("#autoComplete"),
				position: "afterend",
			},
			resultItem: {
				content: null, //function (data, source) {source.innerHTML = data.match;},
				element: "li",
			},
			noResults: function () {
				const result = document.createElement("li");
				result.setAttribute("class", "no_result");
				result.setAttribute("tabindex", "1");
				result.innerHTML = "No Results";
				document.querySelector("#autoComplete_list").appendChild(result);
			},
			onSelection: function (feedback) {
				document.querySelector("#autoComplete").blur();
				const selection = feedback.selection.value.food;
				// Render selected choice to selection div
				document.querySelector(".selection").innerHTML = selection;
				// Clear Input
				document.querySelector("#autoComplete").value = "";
				// Change placeholder with the selected value
				document.querySelector("#autoComplete").setAttribute("placeholder", selection);
				// Concole log autoComplete data feedback
				console.log(feedback);
			},
		});
	})
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