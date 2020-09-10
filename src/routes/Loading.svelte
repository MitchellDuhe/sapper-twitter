<script>
  // import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  export let loadingText;
  let fadeInOut = true
  
  const forceFadeInOut = (val)=>{
    fadeInOut = !fadeInOut
  }
  
  $: forceFadeInOut(loadingText)
</script>

  {#if fadeInOut}
  <p 
    class="loading"
    > {loadingText} </p>
  {:else}
    <p 
      class="loading"
      > {loadingText} </p>
  {/if}

<style>

.loading{
  transition: 1s;
  align-self:center;
  position: absolute;
  margin: auto;
  color: #333;
  font-size: 2rem;
  width: 80%;
  padding-right: 2%;
  z-index: 1;
}

</style>