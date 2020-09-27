<script>
  export let count;
  export let index;
  export let initialOffset;
  export let mobileDevice;
  let x = initialOffset + index*(250+100); //make x the offset of all the used bars so far + the groupwidths
  let y = '-100%'; 
  let height = mobileDevice ? '500px' : '90%';
  console.log(mobileDevice)

 
</script>


  <foreignObject class="word-groups" width="250px" {height}
    {x}
    {y}
  >
    <body class="foreign-body" xlmns="http://www.w3.org/1999/xhtml"
      class:mobileDevice>
      <div class="word-groups-inner-container"
        class:mobileDevice>
        <div class='text-holder'
          class:mobileDevice> 
          <div 
            class='num-header'
            class:mobileDevice
            class:twoDigit={count[0].length>1}
          >
            {count[0]}
          </div>
      <p class="words" class:mobileDevice>{count[1].join(' ')}</p>
        </div>
      </div>
    </body>
  </foreignObject>

<style>
  .word-groups-inner-container{
    position: fixed;
    top: 0px;
    left: 0px;
    margin:0px;
    padding:0px;
    width:100%;
    height:100%;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: var(--dark-color) var(--lighter-color);
    background-color:var(--plot-colorful);
    background: linear-gradient(var(--plot-colorful) 50%, var(--plot-colorful-secondary) 100%);
    display: block;
  }

  .foreign-body{
    position:relative;
    display: flex;
    justify-content: start;
    top: 0px;
    left:0px;
  }

  .foreign-body.mobileDevice{
    transform: scaleY(-1);
  }
  
  .words{
    position:absolute;
    top:0px;
    left:0px;
    padding-bottom:1rem;
    line-height:2.5rem;
    font-size:20px;
    color: var(--plot-background);
    font-weight: bold;
    text-align:justify;
    margin:20px;
    overflow-wrap: normal;
    z-index:1;
  }
  
  .word-groups-inner-container::-webkit-scrollbar {
    width: 11px;
  }
  
  .word-groups-inner-container::-webkit-scrollbar-track {
    background: var(--lighter-color);
  }
  
  .word-groups-inner-container::-webkit-scrollbar-thumb {
    background-color: var(--dark-color) ;
    border-radius: 6px;
    border: 3px solid var(--lighter-color);
  }

  .word-groups {
    /* width:250px;
    height:90%; */
    position:relative;
    background-color:var(--plot-colorful);
    background: linear-gradient(var(--plot-colorful) 50%, var(--plot-colorful-secondary) 100%);
    transform: scaleY(-1);
    border-radius: 15px;
    /* overflow-y: scroll; */
  }

  .text-holder {
    position: relative;
    top:0px;
    left:0px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    width:100%;
    height:100%;
    box-sizing: border-box;
    padding:20px;

  }
  .num-header {
    position: relative;
    margin:0px auto;
    font-size:250px;
    font-weight:bold;
    color:rgba(255, 255, 255, 0.1);
  }

  .num-header.twoDigit {
    font-size: 200px;
    margin-left:-25px;
    margin-top:30px;
  }

  
  .word-groups-inner-container.mobileDevice,
  .text-holder.mobileDevice,
  .num-header.mobileDevice{
    height:500px;
    z-index: 2;
    top:0px;
    left:0px;
  }
</style>