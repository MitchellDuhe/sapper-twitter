<script>
    import { tick, createEventDispatcher, onMount } from 'svelte'
    const dispatch = createEventDispatcher();
    import SearchIcon from './SearchIcon.svelte'
    import Autocomplete from './Autocomplete.svelte'
    import handleCookie from'./cookieUtils.js'
    export let searchError;
    export let centered = true;
    const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent)
    // const mobileDevice=false;
    let button, search;
    let strokeWidth = 4;
    $: strokeWidth = centered ? 4 : 2;
    
    //================
	//   searchning
	//================
    
    let activeButton = false;
    let returnEnd = true;
    let showDropdown = false;
    let selectedIndex = 0;
    function handleKeydown(event){
        dispatch('clearError');
        showDropdown = true;
        if (event.keyCode === 13 && returnEnd){
            returnEnd = false;
            activeButton = true;
            enterSearch()
        } else if (event.keyCode === 38) {//up
            selectedIndex = selectedIndex - 1;
            if (selectedIndex < 0) selectedIndex = 0;
        } else if (event.keyCode === 40) {//down
            selectedIndex = selectedIndex + 1;
            if (selectedIndex >= topResults.length) selectedIndex = topResults.length;
            if (selectedIndex < 0) selectedIndex = 0;
        } else {
            selectedIndex = 0;
        }
    }

    function handleKeyup(event){
        if (event.keyCode === 13){ 
            returnEnd = true;
            activeButton = false;
            button.click();
        }
    }
    let user_id, newUser;
    async function setSearcherInfo(searchValue){
        [user_id, newUser] = await handleCookie('_id');
        const data = {
            user_id,
            newUser,
            searchValue
        }
        try{
            let response = await fetch('/saveSearcher', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let result = await response.json()
        } catch(err) {
            console.log('POST error', err.message)
        }
    }

    async function enterSearch(){
        showDropdown = false;
        let selected, displayedSearch,userInDB;
        if (selectedIndex === topResults.length){
            selected = {value:{handle:search.value}}
            displayedSearch = search.value
            userInDB = false;
        } else {
            selected = topResults[selectedIndex];
            displayedSearch = selected.value[selected.key];
            search.value = displayedSearch;
            userInDB = true;
        }
        let searcherInfo = await setSearcherInfo(selected.value.handle)
        dispatch('decenter',{
            handle: selected.value.handle,
            displayedSearch,
            userInDB
        });
        await tick();
        search.blur();
        activeButton = false;
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
        topResults = filterTopResults(e.detail.results)

    }
    
    const filterTopResults =(results)=>{
        let used = []
        let trimmed = results.filter(result=>{
        if (used.indexOf(result.index)>-1){
            return false
        } else {
            used.push(result.index)
            return true
        }
        })
        return trimmed.slice(0,5)
    }

    //=================
    //    mouse
    //=================

    const handleEntryHover = (event)=>{
        selectedIndex = event.detail.index;
    }
    
    const handleEntryClick = (event)=>{
        selectedIndex = event.detail.index;
        enterSearch();
    }

    const handleFocus = ()=>{
        showDropdown=true
        dispatch('clearError');
    }

</script>

<svelte:body 
  on:click={bodyClick}
/>

<div 
    class:centered
    class="search-and-button">
    <div class="search-and-autocomplete">
        {#if searchError}
            <div class="search-error">
                {searchError}
            </div>
        {/if}
        <input 
            type="text" 
            class="search" 
            id="autoComplete"
            placeholder="Enter Twitter User"
            on:autoComplete={handleAutoComplete}
            on:focus={handleFocus}
            on:keydown={handleKeydown}
            on:keyup={handleKeyup}
            bind:this={search}
            bind:value={searchText}
            maxlength="51">
            
        <Autocomplete {searchText} {centered} {showDropdown} {topResults} {selectedIndex} {mobileDevice}
            on:entryHover={handleEntryHover}
            on:entryClick={handleEntryClick}/>
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
    /* ===================== */
    /*      decentered       */
    /* ===================== */
    
    .search-and-button{
        --decenteredHeight: 36px;
        height:var(--decenteredHeight);
        width:100%;
        display: flex;
        flex-wrap: nowrap;
        font-size: 1rem;
    }

    .search-and-autocomplete{
        display: flex;
        flex-direction: column;
        width:225px;
        position:relative
        /* transition: all 4000ms ease-out 0ms; */
    }
    .search{
        border-radius: 15px;
        height:var(--decenteredHeight);
        padding-left:5%;
        padding-bottom: 5%;
        z-index: 1;
        font-size: 1.25rem;
        border:1px solid var(--lighter-color);
        width:225px;
    }
    
    .search:focus{
        outline: none;
        border:1px solid var(--darkest-color);
        box-shadow: 0 0 3px var(--lighter-color);
    }

    .search-button{
        cursor: pointer;
        height: 36x;
        width: var(--decenteredHeight);
        margin:0 0.5rem;
        text-align: center;
        border:none;
        border-radius: 50%;
        padding:0;
        background-color: var(--lighter-color);
    }

    .search-button:hover{
        background-color: var(--light-color);
    }

    .search-button:active,.activeButton{
        background-color: var(--dark-color);
    }

    .search-and-button, .search-and-button * {
        transition: all 400ms ease-out 0ms;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* ===================== */
    /*        centered       */
    /* ===================== */

    .search-and-button.centered{
        font-size: 2rem;
    }
    .search-and-button.centered  .search-button{
        width:50px;
        height:50px;
        margin-left: 0.5rem;
    }

    .search-and-button.centered  .search{
        height:50px;
        font-size: 1.5rem;
        border-radius: 25px;
        width:300px;
        padding-bottom:4%;
        padding-left:20px;
    }
    .search-and-button.centered  .search-and-autocomplete{
        height:50px;
        border-radius: 25px;
        width:300px
    } 

    .search-and-button.centered  .search:focus{
        border:2px solid var(--darkest-color);
        box-shadow: 0 0 6px var(--lighter-color);
    }

    .search-and-button.centered .search-error {
        font-size:1.25rem;
        top:-3rem;
        padding:1rem;
    }
    
    .search-error { 
        font-size: 1rem;
        color: lightcoral;
        position: absolute;
        height: 1rem;
        top: -2rem;
        padding: 0.5rem;
        white-space: nowrap;
    }
</style>