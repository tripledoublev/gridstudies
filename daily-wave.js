import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  let waveCounter = 0; // Counter for the wave effect
  const updateFrequency = 125; // Update every 100 milliseconds for a smoother effect

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

    // Create a wave effect across the lit LEDs
    if (ledsToLightUp > 0) {
      let waveLength = ledsToLightUp * 0.50; // Length of the wave
      for (let i = 0; i < waveLength; i++) {
        let index = (waveCounter + i) % ledsToLightUp;
        let x = index % 8;
        let y = Math.floor(index / 8);
        led[y][x] = 0;
      }
      waveCounter = (waveCounter + 1) % ledsToLightUp;
    }

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, updateFrequency); // Update more frequently

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
