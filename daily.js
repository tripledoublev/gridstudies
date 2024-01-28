import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  function updateGridWithTime() {
    const currentTime = new Date();
    const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const totalLEDs = 64; // 8x8 grid
    const minutesPerLED = (24 * 60) / totalLEDs; // Total minutes in a day divided by total LEDs
    const ledsToLightUp = Math.floor(totalMinutes / minutesPerLED);

    // Clear the grid
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        led[y][x] = 0;
      }
    }

    // Light up the LEDs according to the time of day
    for (let i = 0; i < ledsToLightUp; i++) {
      let x = i % 8;
      let y = Math.floor(i / 8);
      led[y][x] = 15; // Assuming 15 is max brightness
    }

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000); // Update every minute

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
