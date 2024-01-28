import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  function numberToBinaryArray(number, length) {
    return number.toString(2).padStart(length, '0').split('').map(bit => parseInt(bit));
  }

  function updateGridWithTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Convert to binary
    const binaryHours = numberToBinaryArray(hours, 5); // 5 bits for hours (0-23)
    const binaryMinutes = numberToBinaryArray(minutes, 6); // 6 bits for minutes (0-59)
    const binarySeconds = numberToBinaryArray(seconds, 6); // 6 bits for seconds (0-59)

    // Clear the grid
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        led[y][x] = 0;
      }
    }

    // Function to light up a 1x2 vertical block
    function lightUpBlock(x, y, isOn) {
      let brightness = isOn ? 15 : 0; // Assuming 0 is off and 15 is max brightness
      led[y][x] = brightness;
      led[y + 1][x] = brightness;
    }

    // Display hours, minutes, seconds
    binaryHours.forEach((bit, idx) => lightUpBlock(idx, 0, bit)); // Top two rows for hours
    binaryMinutes.forEach((bit, idx) => lightUpBlock(idx, 2, bit)); // Middle two rows for minutes
    binarySeconds.forEach((bit, idx) => lightUpBlock(idx, 4, bit)); // Bottom two rows for seconds

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000);

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
