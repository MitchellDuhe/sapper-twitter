<script>
  import { tweened } from 'svelte/motion'
  import * as easings from 'svelte/easing';
  import { onMount } from 'svelte';
  
  let x,y;
  let SVGlength
  let dx=0;
  let dy=0;
  export let unScaledValue = 0
  let valueLength = unScaledValue.toString().length
  let barCountOffsetX,barCountFontSize,barCountOffsetY,barNumberColor;
  if (valueLength === 1) {
    barCountOffsetX = -6;
    barCountFontSize = 22;
  } else if (valueLength === 2) {
    barCountOffsetX = -11;
    barCountFontSize = 20;
  } else if (valueLength === 3) {
    barCountOffsetX = -14;
    barCountFontSize = 16;
  } else if (valueLength >= 4) {
    barCountOffsetX = -14;
    barCountFontSize = 12;
  }

  export let value = 0
  // console.log(value)
  if (value/3 < barCountFontSize){
    barCountOffsetY = 10;
    barNumberColor = 'blueviolet';
  } else {
    barCountOffsetY = -24;
    barNumberColor = 'beige';
  }

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
    dy = -length/1.5;
    dx = -length/1.5;
  })

</script>

<g class='bar-with-info'>
  <rect 
    {x} 
    {y} 
    width={barWidth} 
    value={unScaledValue}
    height={Math.abs($height)} 
    class="graph-bar" 
    class:final>
  </rect>
  <g
    style="transform:translateX({x+barWidth/2}px)"
    y=-5> 
    <text 
      style={`transform:translate(${barCountOffsetX}px,${Math.abs($height)+barCountOffsetY}px) scaleY(-1);
              font-size:${barCountFontSize}px;
              fill:${barNumberColor}`}
      class="graph-text">
      {unScaledValue}
    </text>
    <text 
      style={`transform:translate(${dx}px,${dy}px) rotate(45deg) scaleY(-1);`}
      class="sub-bar"
      bind:this={SVGlength}>
        {text}
    </text>
  </g>
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
  
  .bar-with-info{
    transform: translate(2rem, 6rem);
  }

  .graph-bar{
    margin:.5rem;
    fill: blueviolet;
    margin-bottom: 0;
  }

  .graph-bar:hover {
    transition:100ms;
    fill:blue;
    cursor: pointer;
  }

  .graph-text{
    font-weight: bold;

  }
  
</style>