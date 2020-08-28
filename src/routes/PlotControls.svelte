<script>
  import { createEventDispatcher } from 'svelte'
  
  // import { peopleData } from '../public/db/stores.js'

  const dispatch = createEventDispatcher();
  
  let newData,selector;
  
	const handleNewData = ()=>{
    peopleData.update(currentData=>{
      let updatedData = [...currentData]
			let updatedPerson = updatedData.find(person=>person.name === selector);
      updatedPerson.followers = parseInt(newData);
			return updatedData
		})
    dispatch('newNumber')
  }

</script>

<div class="container">
  <input 
    type="number" 
    bind:value={newData} 
    on:blur={handleNewData}>
  <select bind:value={selector}>
    {#each $peopleData as person}
      <option value={person.name}>
        {person.name}
      </option>
    {/each}
  </select>
</div>

<style>

.container{
  width: 25%;
  margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
  align-items: center;
}

.container * {
  margin-top: 20px;
}


</style>