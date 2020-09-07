<script>

  export let count;
  export let index;
  export let initialOffset;
  let x = initialOffset + index*(250+100); //make x the offset of all the used bars so far + the groupwidths
  let y = '-100%';
</script>


  <foreignObject class="word-groups"
    {x}
    {y}>
    <div class='text-holder'>
      <div class='num-header'>{count[0]}</div>
      <p class="words">{count[1].join(' ')}</p>
    </div>
  </foreignObject>

<style>
  .words{
    padding:0 2px;
    font-size:20px;
    color:beige;
    text-align:justify;
    margin:0;
    overflow-wrap: normal;
    z-index:1;
  }

  .word-groups{
    width:250px;
    height:90%;
    background-color:blueviolet;
    transform: scaleY(-1);
    border-radius: 15px;
    overflow-y: scroll;
  }

  .text-holder {
    position: relative;
    display: flex;
    flex-direction: column;
    fill:blueviolet;
    width:100%;
    height:100%;
    box-sizing: border-box;
    padding:20px;
  }
  .num-header {
    position: absolute;
    margin:0 auto;
    font-size:250px;
    font-weight:bold;
    color:rgba(255, 255, 255, 0.1);
  }

</style>