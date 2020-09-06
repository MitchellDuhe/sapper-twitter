<script>
  import { pannable } from './pannable.js'
  import { onMount,afterUpdate,tick } from 'svelte'
  import Barplot from './Barplot.svelte'
  import PlotControls from './PlotControls.svelte'
	import { userTweetData } from './userTweetData.js'
  
  export let user;
  
  let plotWindow;
  //==================
  //      axis
  //==================

  let yAxis;
  let plotHeight;
  let remOffset = 4;

  let showPlot=false;
	
  onMount(async ()=>{
    handleResize();
    showPlot=true;
    await tick();
    handleScroll();
  })

  let scaleDims ={
    domain:{},
    range:{}
  };
  const scaleYaxis = (data)=>{
    if (data.max === 0) { return }
    let ymax;

		if (data.max < 5){
      ymax = data.max;
    } else if (data.max < 150) {
			ymax = Math.round(data.max/10)*10;
    } else if (data.max < 5000) {
      ymax = Math.round(data.max/100)*100;
    } else {
      ymax = Math.round(data.max/1000)*1000;

    }
    scaleDims.domain.x = 0;
    scaleDims.domain.y = ymax;
    scaleDims.range.x = plotHeight-16*remOffset;
    scaleDims.range.y = 0;
    let scale = d3.scaleLinear()
			.domain([scaleDims.domain.x,scaleDims.domain.y])
      .range([scaleDims.range.x, scaleDims.range.y]); //this adjustment is for the rem offset up on the bars for the words at the bottom
		let y_axis = d3.axisLeft()
      .scale(scale)
      .tickFormat((e) => {
        if(Math.floor(e) != e) return;
        return e;
      });
    d3.select('.left-axis')
      .call(y_axis)
    d3.selectAll('.tick')
      .style('font-size','0.8rem')
      .style('user-select','none')
  }
  
  $: scaleYaxis($userTweetData)

  let windowWidth;
  const handleResize = ()=>{
    plotHeight = window.innerHeight*0.80;
    scaleYaxis($userTweetData);
  }

  //==================
  //     scrolling
  //==================
  let scrollOnRelease = 0;
  const handlePanMove = (event)=>{
    plotWindow.scrollLeft = plotWindow.scrollLeft + (-event.detail.dx)
    scrollOnRelease = event.detail.dx 
  }
  const handlePanEnd = ()=>{
    decayScroll()
  }

  const decayScroll = async ()=>{
    let decay = scrollOnRelease/10;
    while (Math.abs(scrollOnRelease) > 10) {
      plotWindow.scrollLeft = plotWindow.scrollLeft - scrollOnRelease
      await waitX(10)
      scrollOnRelease = scrollOnRelease-decay
      decay = decay*.85
      if (Math.abs(decay) < 0.75 ) { decay = decay > 0 ? 0.75 : -0.75 }
    }
    function waitX(t){ 
      return new Promise((resolve,reject)=>{
        setTimeout(resolve,t)
      });
    }
  }
  
  let distanceToEnd = 50;
  const handleScroll = async ()=>{ 
    await tick()
    distanceToEnd = plotWindow.scrollWidth - (plotWindow.scrollLeft + plotWindow.offsetWidth);
    if (distanceToEnd > 50){
      distanceToEnd = 50;
    }
  }

  export let displayedSearch;
</script>

<svelte:window 
  on:resize={handleResize}
  bind:innerWidth={windowWidth}/>

{#if showPlot}
<div class="container">
  <div class="header">
    { displayedSearch } Weekly Word Usage
  </div>
  <div class="plot-and-axis">
    <svg
      class="y-axis"
      style={`height:${plotHeight+16}px`}
      bind:this={yAxis}>
      <g class="left-axis"></g>
    </svg>
    <div class="plot-window"
      use:pannable
      on:scroll={handleScroll}
      on:panmove={handlePanMove}
      on:panend={handlePanEnd}
      bind:this={plotWindow}>
      <Barplot {plotHeight} {windowWidth} {user} {scaleDims}
        on:plotWidthChange={handleScroll}/>
    </div>
    <div 
      class="plot-shadow"
      use:pannable
      on:panmove={handlePanMove}
      on:panend={handlePanEnd}
      style={`right:${-50+distanceToEnd}px`}>
    </div>
  </div>
  <!-- <PlotControls on:newNumber={scaleYaxis}/> -->
</div>
{/if}



<style>
  .plot-shadow{
    background:linear-gradient(90deg, rgba(255,255,255,0) 20%, rgba(51,51,51,1) 100%);
    height:100%;
    width: 50px;
    position: absolute;
    transition: 100ms ease-in-out;
    cursor: grab;
  }

  .plot-shadow:active{
    cursor:grabbing;
  }

  .plot-and-axis{
    margin:auto;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
  }

  .y-axis{
    width:50px;
    padding-bottom: calc(2rem - 5px);
    padding-top:calc(1rem + 5px); ;
    margin-bottom: 0;
    background-color: beige;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  .left-axis{
    transform: translate(50px,10px);
  }
  
  .container{
    margin:auto;
    display: flex;
    flex-direction: column;
  }


  .plot-window{
    display: flex;
    flex-direction: column;
    width: 50vw;
    overflow-x: scroll;
    justify-content: center;
		/* border-top-right-radius: 25px; */
    /* border-bottom-right-radius: 25px; */
  }

  .plot-window::-webkit-scrollbar{
		display: none;
	}
  
	.header {
		margin:1rem auto;
		font-size: 2rem;
	}

</style>