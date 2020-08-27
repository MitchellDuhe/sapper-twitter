<script>
    import { tick, createEventDispatcher, onMount } from 'svelte'
    import SearchIcon from './SearchIcon.svelte'
    import Autocomplete from './Autocomplete.svelte'

    const dispatch = createEventDispatcher();
    let button, search;
    let activeButton = false;
    let returnEnd = true;
    let strokeWidth = 4;
    export let centered = true;

    $: strokeWidth = centered ? 4 : 2;

    let showDropdown = false;
    function handleKeydown(event){
        showDropdown = true;
        if (event.keyCode === 13 && returnEnd){
            returnEnd = false;
            activeButton = true;
            enterSearch()
        }
    }

    function handleKeyup(){
        if (event.keyCode === 13){ 
            returnEnd = true;
            activeButton = false;
            button.click();
        }
    }

    function enterSearch(){
        
        showDropdown = false;
        dispatch('decenter')
    }

    onMount(()=>{
        search.focus()
    })

    let searchText;
    const bodyClick = e=>{
        showDropdown = (e.target===search)
    }

    let topResults = [];
    const handleAutoComplete = e => {
        // console.log(e.detail.results)
        topResults = e.detail.results;
    }
</script>

<svelte:body 
  on:click={bodyClick}
/>

<div 

class:centered
    class="search-and-button">
    <div class="search-and-autocomplete">
        <input 
            type="text" 
            class="search" 
            id="autoComplete"
            placeholder="Type Here"
            on:autoComplete="{handleAutoComplete}"
            on:click="{()=>showDropdown=true}"
            on:keydown={handleKeydown}
            on:keyup={handleKeyup}
            bind:this={search}
            bind:value={searchText}>
            
        <Autocomplete {searchText} {centered} {showDropdown} {topResults} />
    </div>      
    <button 
        bind:this={button} 
        class:activeButton
        class="search-button" 
        on:click={enterSearch}
        >
        <SearchIcon color='#333' {strokeWidth}/>
    </button>
</div>

<style>
    .search-and-autocomplete{
        display: flex;
        flex-direction: column;
        width:150px;
        /* transition: all 4000ms ease-out 0ms; */
    }
    .search{
        border-radius: 12.5px;
        height:25px;
        padding-left:5%;
        padding-bottom: 5%;
        z-index: 1;
        font-size: 1rem;
        width:150px;
    }
    .search-and-button{
        height:25px;
        width:100%;
        display: flex;
        flex-wrap: nowrap;
        font-size: 16px;
    }
    .search-button{
        height: 25px;
        width:25px;
        margin:0 0.5rem;
        text-align: center;
        border:none;
        border-radius: 50%;
        padding:0;
        background-color: var(--lighter-color);
    }
    .search-button:active,.activeButton{
        background-color: var(--lighter-color);
    }

    .search-and-button.centered{
        font-size: 2rem;
    }
    .search-and-button.centered  .search-button{
        width:50px;
        height:50px;
        margin: 0 1rem;
    }

    .search-and-button.centered  .search{
        height:50px;
        font-size: 1.5rem;
        border-radius: 25px;
        width:300px;
        padding-bottom:4%;
    }
    .search-and-button.centered  .search-and-autocomplete{
        height:50px;
        border-radius: 25px;
        width:300px
    }   
    .search-and-button, .search-and-button * {
        transition: all 400ms ease-out 0ms;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search:focus{
        outline: none;
        border:1px solid var(--darkest-color);
        box-shadow: 0 0 3px var(--lighter-color);
    }
    .search {
        border:1px solid var(--lighter-color);
    }



    .search-and-button.centered  .search:focus{
        border:2px solid var(--darkest-color);
        box-shadow: 0 0 6px var(--lighter-color);
    }

</style>