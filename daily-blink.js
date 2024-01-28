import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  let secondaryCounter = 0; // Secondary counter for the moving effect

  function updateGridWithTime() {
    const currentTime = new Date();
    const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const totalLEDs = 64; // 8x8 grid
    const minutesPerLED = (24 * 60) / totalLEDs; // Total minutes in a day divided by total LEDs
    const ledsToLightUp = Math.floor(totalMinutes / minutesPerLED);

    // Clear the grid
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        led[y][x] = 15; // Initially turn on all LEDs
      }
    }

    // Turn off LEDs that should not be lit
    for (let i = ledsToLightUp; i < totalLEDs; i++) {
      let x = i % 8;
      let y = Math.floor(i / 8);
      led[y][x] = 0;
    }

    // Turn off one LED at a time for the moving effect
    if (ledsToLightUp > 0) {
      let x = secondaryCounter % 8;
      let y = Math.floor(secondaryCounter / 8);
      if (secondaryCounter < ledsToLightUp) {
        led[y][x] = 0;
      }
      secondaryCounter = (secondaryCounter + 1) % ledsToLightUp;
    }

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000); // Update every second

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
