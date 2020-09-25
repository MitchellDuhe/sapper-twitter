<script>
  import { createEventDispatcher} from 'svelte'
	import { fade } from 'svelte/transition';
  export let searchText = '';
  export let centered = true;
  export let topResults = [];
  export let selectedIndex = 0;
  export let showDropdown = false;
  // export let mobileDevice;
  // const mobileDevice = false;

  function truncateFollowers(number){
    let reduced = Number(number).toLocaleString();
    if (number > 1000000){
      number /= 1000000
      let rounded = Math.round(number * 10) / 10
      let fixed = rounded.toFixed(1)
      reduced = fixed + 'M'
    }

    return reduced;
  }

  const dispatch = createEventDispatcher()
  function handleHover(i){
    dispatch('entryHover',{index:i})
  }

  function handleClick(i){
    dispatch('entryClick',{index:i})
  }
  // const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent)
  // const mobileDevice = false;
  export let mobileDevice
</script>

{#if searchText.length > 0 && showDropdown}
  <div 
    in:fade="{{duration:200}}" 
    class="dropdown" 
    class:centered
    class:mobileDevice
    class:firstHover="{selectedIndex===0}">
    {#if topResults.length === 0}
      <div 
        on:mouseenter={()=>{handleHover(0)}}
        on:click={()=>{handleClick(0)}}
        class="entry lastChild selected">
        <p class="no-results">No Results, Click here to search new handle</p>
      </div>
    {:else}
      {#each topResults as person,i}
        <div 
          on:mouseenter={()=>{handleHover(i)}}
          on:click={()=>{handleClick(i)}}
          class="entry" 
          class:selected="{i===selectedIndex}">
          <div class="name">
            <p>{person.value.name}</p>
          </div>
          <div class="info">
            <p>{'@'+person.value.handle}</p>
            <p>Followers: {truncateFollowers(person.value.followers)}</p>
          </div>
        </div>
      {/each}
      <div 
        on:mouseenter={()=>{handleHover(topResults.length)}}
        on:click={()=>{handleClick(topResults.length)}}
        class:selected="{topResults.length===selectedIndex}"
        class="entry lastChild">
        <p class="no-results">Click here to search new handle</p>
      </div>
    {/if}
  </div>
{/if}
<!-- old entry last child => class:lastChild="{i+1===topResults.length}" -->
<style>
  .dropdown.firstHover{
    transition: 200ms ease, border-radius 0ms 0ms;
    background-color:  var(--light-color);
  } 
  
  .dropdown{
    background-color:  var(--lighter-color);
    display: flex;
    flex-direction: column;
    margin-top: -1.3rem;
    padding-top: 1rem;
    width:100%;
    box-sizing:border-box;
    overflow:visible;   
    border-bottom-left-radius: 12.5px;
    border-bottom-right-radius: 12.5px;
  }

  .dropdown.mobileDevice{
    min-height: 2rem;
  }
  .dropdown.centered.mobileDevice{
    min-height: 6rem;
  }

  .dropdown.centered .entry.lastChild {
    border-bottom-left-radius:25px;
    border-bottom-right-radius:25px;
  }

  .entry.lastChild {
    /* transition: 0s; */
    border-bottom-left-radius:12.5px;
    border-bottom-right-radius:12.5px;
  }

  .dropdown, .dropdown *{
    cursor: pointer;
    user-select: none;
  }

  .dropdown.centered{
    margin-top: -2.2rem;
    padding-top: 1.5rem;
    border-bottom-left-radius:25px;
    border-bottom-right-radius:25px ;
  }

  .entry {

    transition: border-radius 0s;
    padding: .3rem .75rem;
    margin:-1px 0;
    display: block;
    flex-direction: column;
    background-color:  var(--lighter-color);
  }

  
  .dropdown.centered .entry {
    padding: .33rem 1rem;
  }

  .entry:hover, .entry.selected {
    transition: 200ms ease, border-radius 0ms 0ms;
    background-color: var(--light-color);
  }

  .entry * {
    transition: all 400ms ease-out 0ms, border-radius 0ms 0ms;
    margin:0;
    font-size: 1rem;
  }

  .dropdown.centered .entry * {
    font-size: 1rem;
    margin:1px;
  }

  .name, .no-results {
    color: var(--darkest-color);
    font-weight: 500;
   }

  .info{
    color: var(--darker-color);
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .dropdown.centered .info {
    justify-content: space-between;
    flex-direction: row;

  }

</style>