<script>
  import { tweened } from 'svelte/motion'
  import * as easings from 'svelte/easing';
  import { onMount } from 'svelte';

  
  let x,y;
  let SVGlength
  let dx=0;
  let dy=0;
  let dyAdd = 0;
  export let unScaledValue = 0;
  export let mobileDevice;
  let valueLength = unScaledValue.toString().length
  let barCountOffsetX,barCountFontSize,barCountOffsetY,graphNumInner,graphNumAbove;
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
    graphNumAbove = true;
  } else {
    barCountOffsetY = -24;
    graphNumInner = true;
  }


  export let index = 0;
  export let barWidth = 20;
  export let barSpace = 20;
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
    let length = SVGlength.getBBox().width
    dy = -length/1.5;
    dx = -length/1.5;
    if (mobileDevice){
      dyAdd=40;
    }
  })
  

</script>

<g class='bar-with-info'>
  <rect 
    {x} 
    {y} 
    width={barWidth} 
    value={unScaledValue}
    height={Math.abs($height)} 
    class="graph-bar">
  </rect>
  <g
    style="transform:translateX({x+barWidth/2}px)"
    y=-5> 
    <text 
      style={`transform:translate(${barCountOffsetX}px,${Math.abs($height)+barCountOffsetY}px) scaleY(-1);
              font-size:${barCountFontSize}px;`}
      class="graph-num"
      class:graphNumInner
      class:graphNumAbove>
      {unScaledValue}
    </text>
    <text 
      style={`transform:translate(${dx}px,${dy + dyAdd}px) rotate(45deg) scaleY(-1);`}
      class="word"
      bind:this={SVGlength}>
        {text}
    </text>
  </g>
</g>

<style>  
  .word{
    transform-origin: 30px 0px;
    fill: #333;
    font-size:1rem;
  }
  
  .bar-with-info{
    transform: translate(2rem, 6rem);
  }

  .graph-bar{
    margin:.5rem;
    fill:var(--plot-colorful);
    margin-bottom: 0;
  }
  
  .graph-bar:hover {
    transition:500ms;
    fill:url(#grad3);
    cursor: pointer;
  }

  .graph-bar:hover ~ g > .word {
    font-weight: bold;
  }

  .graph-num{
    font-weight: bold;
  }
  .graphNumInner{
    fill:var(--plot-background);
  }
  .graphNumAbove{
    fill:var(--plot-colorful);
  }
  
</style>