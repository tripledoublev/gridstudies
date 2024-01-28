import monome from 'monome-grid';
import Audic, {playAudioFile} from 'audic';
const monomeGrid = monome;


async function run() {
  let grid = await monomeGrid(); // optionally pass in grid identifier

  // initialize 2-dimensional led array
  let led = [];
  for (let y=0;y<8;y++) {
    led[y] = [];
    for (let x=0;x<16;x++)
      led[y][x] = 0;
  }

  // refresh leds with a pattern
  let refresh = function() {
    led[0][0] = 15;
    led[2][0] = 5;
    led[0][2] = 5;
    grid.refresh(led);
	  
  }


  let trigger = async function(type, i) {
   if(type=="play") {
    console.log("trigger: play: "+i);
     await playAudioFile(i+'.mp3');
   }
  }


  // call refresh() function 60 times per second
  setInterval(refresh, 1000 / 60);

  // set up key handler
  grid.key((x, y, s) => {
      trigger("play","a1");
      //trigger("noteon",y);
	  
      console.log(`key received: ${x}, ${y}, $[s}`);
  });
}


run();