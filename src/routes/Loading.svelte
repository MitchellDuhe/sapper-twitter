<script>
  import { fade } from 'svelte/transition'
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
    transition:fade> {loadingText} </p>
  {:else}
    <p 
      class="loading"
      transition:fade> {loadingText} </p>
  {/if}

<style>

.loading{
  transition: 1s;
  align-self:center;
  position: absolute;
  margin: auto;
  color: #333;
  font-size: 2rem;
  z-index: 1;
}

</style>