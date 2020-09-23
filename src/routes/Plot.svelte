<script>
  import { pannable } from './pannable.js'
  import { onMount,afterUpdate,tick } from 'svelte'
  import Barplot from './Barplot.svelte'
  import { userTweetData } from './userTweetData.js'
  
  
  export let user;
  export let userInDB;
  export let autoCompleteObject;
  // const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent)
  export let mobileDevice;
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
    if (data === undefined || data.max === 0) { return }
    let ymax;

		if (data.max < 10){
      ymax = data.max;
    } else if (data.max < 50) {
			ymax = Math.ceil(data.max/5)*5;
    } else if (data.max < 150) {
			ymax = Math.ceil(data.max/10)*10;
    } else if (data.max < 5000) {
      ymax = Math.ceil(data.max/100)*100;
    } else {
      ymax = Math.ceil(data.max/1000)*1000;

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
    if (window.innerWidth < 1400){
      plotHeight = Math.floor(window.innerHeight*0.75);
    } else {
      plotHeight = Math.floor(window.innerHeight*0.80);
    }
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
    {#if $userTweetData.userPic !== undefined}
      <a target='_blank' href={$userTweetData.userPic}><img class="profile-pic" src={$userTweetData.userPic} alt="profile_pic"></a>
    {/if}
    <span>{ displayedSearch } Weekly Word Usage. ({$userTweetData.nTweets} Tweets)</span>
  </div>
  <div class="plot-and-axis">
    <svg
      class="y-axis"
      style={`height:${plotHeight+16}px`}
      bind:this={yAxis}>
      <g class="left-axis"></g>
    </svg>
    <!-- <div class="scrollbar-container">
      <div class="scrollbar"></div>
    </div> -->
    <div class="plot-window"
      use:pannable
      on:scroll={handleScroll}
      on:panmove={handlePanMove}
      on:panend={handlePanEnd}
      bind:this={plotWindow}>
      <Barplot {plotHeight} {windowWidth} {user} {scaleDims} {userInDB} {autoCompleteObject} {mobileDevice}
        on:plotWidthChange={handleScroll}/>
    </div>
    {#if mobileDevice}
      <div class="plot-arrow"
        use:pannable
        on:panmove={handlePanMove}
        on:panend={handlePanEnd}
        style={`right:${-50+distanceToEnd}px`}>
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </div>
    {:else}
      <div 
        class="plot-shadow"
        use:pannable
        on:panmove={handlePanMove}
        on:panend={handlePanEnd}
        style={`right:${-50+distanceToEnd}px`}>
      </div>
    {/if}
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
    display: flex;
  }

  .arrow{
    width:100%;
    height:auto;
    align-self: center;
    color:var(--darker-color)
  }

  .plot-arrow{
    display: flex;
    height:100%;
    width: 50px;
    position: absolute;
    transition: 100ms ease-in-out;
    cursor: grab;
    font-size:100px;
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
    background-color: var(--plot-background);
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

	/* .scrollbar-container{
		height:var(--plot-padding-top);
		margin-top:var(--plot-padding-top);
		width:100%;
		background-color:var(--plot-background);
	}

	.scrollbar{
		width:10%;
		height:100%;
		border-radius:calc(var(--plot-padding-top)/2);
		background-color: var(--darker-color);
	} */

  .plot-window{
    display: flex;
    flex-direction: column;
    width: 50vw;
    overflow-x: scroll;
    justify-content: center;
    scrollbar-width: none;
		/* border-top-right-radius: 25px; */
    /* border-bottom-right-radius: 25px; */
  }

  .plot-window::-webkit-scrollbar{
		display: none;
	}
  
	.header {
		margin:1rem auto;
		font-size: 2rem;
    display: inline-flex;
	}

  .header > span {
    margin: 0;
    padding: 0;
  }

  .profile-pic{
    height: 2rem;
    border-radius: 50%;
    margin: 8px 8px 0 0;
  }
  
	@media only screen and (max-width:1400px){
		.plot-window{
			width: 75vw;
    }
    
	}
  
  @media only screen and (max-width:1000px){
    .header{
      font-size: 1.75rem;
    }
  }
  
  @media only screen and (max-width:700px){
    .header{
      font-size: 1.5rem;
    }
	}

</style>