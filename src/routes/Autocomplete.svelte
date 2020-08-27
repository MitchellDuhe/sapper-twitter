<script>
  // import data from './db/data.json'
	import { fade } from 'svelte/transition';
  export let searchText = '';
  export let centered = true;
  export let topResults = [];
  $:topResults = filterTopResults(topResults)
  
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

  export let showDropdown = false;
  // autoComplete.js on type event emitter

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

</script>

{#if searchText.length > 0 && showDropdown}
  <div in:fade="{{duration:200}}" class="dropdown" class:centered>
    {#if topResults.length === 0}
      <div class="entry lastChild">
        <p>No Results</p>
      </div>
    {:else}
      {#each topResults as person,i}
        <div 
          class="entry" 
          class:lastChild="{i+1===topResults.length}">
          <div class="name">
            <p>{person.value.name}</p>
          </div>
          <div class="info">
            <p>{'@'+person.value.handle}</p>
            <p>Followers: {truncateFollowers(person.value.followers)}</p>
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}
  
<style>

  .dropdown{
    background-color:  var(--lighter-color);
    display: flex;
    flex-direction: column;
    margin-top: -1.3rem;
    padding-top: 1rem;
    height:1.3rem;
    width:100%;
    box-sizing:border-box;
  }

  .dropdown.centered .entry.entry.lastChild {
    border-bottom-left-radius:25px;
    border-bottom-right-radius:25px;
  }

  .entry.lastChild {
    transition: 0s;
    border-bottom-left-radius:12.5px;
    border-bottom-right-radius:12.5px;
  }

  .dropdown, .dropdown *{
    cursor: pointer;
    user-select: none;
  }

  .dropdown.centered{
    margin-top: -2.4rem;
    padding-top: 1.5rem;
    height:3.9rem;
    border-bottom-left-radius:25px;
    border-bottom-right-radius:25px ;
  }

  .entry {
    padding: .2rem .75rem;
    margin:-1px 0;
    display: flex;
    flex-direction: column;
    background-color:  var(--lighter-color);
  }

  
  .dropdown.centered .entry {
    padding: .33rem 1rem;
  }

  .entry:hover {
    transition: 200ms ease;
    background-color: var(--light-color);
  }

  .entry * {
    transition: all 400ms ease-out 0ms;
    margin:0;
    font-size: .75rem;
  }

  .dropdown.centered .entry * {
    font-size: 1rem;
    margin:1px;
  }

  .name {
    color:#333;
    font-weight: 500;
   }

  .info{
    font-size: .75rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .dropdown.centered .info {
    justify-content: space-between;
    flex-direction: row;

  }

</style>