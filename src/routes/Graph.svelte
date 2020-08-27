<script>

import { fly } from 'svelte/transition'

</script>

<div class="graph-frame">
  <div class="title">
    Graph Name
  </div>
  <div class="plot">
  </div>
</div>

<style>

.graph-frame{
  background-color: var(--lighter-color);
  display: flex;
  flex-direction: column;
}

.title {
  display: flex;
  justify-content: center;
}

.plot{
  background-color: var(--light-color);
  height:200px;
  width:200px;
}

</style>