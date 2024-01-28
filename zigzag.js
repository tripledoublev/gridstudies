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

    // Function to light up an LED
    function lightUpLed(x, y, isOn) {
      led[y][x] = isOn ? 15 : 0; // Assuming 0 is off and 15 is max brightness
    }

    // Display hours in a zigzag pattern
    binaryHours.forEach((bit, idx) => {
      lightUpLed(idx, idx % 2 === 0 ? 0 : 1, bit);
    });

    // Display minutes in a straight line
    binaryMinutes.forEach((bit, idx) => {
      lightUpLed(idx, 2 + Math.floor(idx / 3), bit);
    });

    // Display seconds in a mirrored pattern compared to minutes
    binarySeconds.forEach((bit, idx) => {
      lightUpLed(7 - idx, 5 + Math.floor(idx / 3), bit);
    });

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000);

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
