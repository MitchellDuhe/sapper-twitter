<script>
  import { tweened } from 'svelte/motion'
  import * as easings from 'svelte/easing';
  import { onMount } from 'svelte';
  
  let x,y;
  let SVGlength
  let dx=0;
  let dy=0;
  
  export let value = 0
  export let index = 0;
  export let barWidth = 20;
  export let barSpace = 20;
  export let final = false;
  export let text = 'loading...';
  
  const height = tweened(0,{
    delay:0,
    duration:1000,
    easing:easings.elasticOut
  })
  
  $: x = index*( barWidth + barSpace );
  $: y = 0;
  $: height.set(value);
  
  onMount(()=>{
    let length = SVGlength.textLength.baseVal.value;
    dy = (150 - length)/1.5;
    dx = (45-length)/1.5;
  })

</script>

<rect 
  {x} 
  {y} 
  width={barWidth} 
  height={Math.abs($height)} 
  class="graph-bar" 
  class:final>
</rect>
<g
  style="transform:translateX({x+barWidth/2}px)"
  y=-5> 
  <text 
    style={`transform:translate(${dx}px,${dy}px) rotate(45deg) scaleY(-1);`}
    class="sub-bar"
    bind:this={SVGlength}>
      {text}
  </text>
</g>

<style>  
  .sub-bar{
    transform-origin: 30px 0px;
    fill: #333;
    font-size:1rem;
  }

  .final{
    fill:red!important;
  }
  .graph-bar{
    transform: translate(2rem, 6rem);
    margin:.5rem;
    fill: blueviolet;
    margin-bottom: 0;
  }

  .graph-bar:hover {
    fill:blue;
    cursor: pointer;
  }
  
</style>