<script>

  export let count;
  let x=0; //make x the offset of all the used bars so far + the groupwidths
  let y=0; // just center the groups
  console.log(count);
</script>

<g class="word-groups"
  {x}
  {y}>
  <rect
    class='text-holder'
    width=200
    height=400>

  </rect>
  <text 
    class='num-header'>
    7
  </text>

  <text>
    word
  </text>
</g>

<style>
  .text-holder {
    fill:blueviolet;
  }
  .num-header {
    font-size:30px;
  }
</style>