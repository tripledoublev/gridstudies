import monomeGrid from 'monome-grid';
import rotateGrid from './rotate.js';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  function numberToBinaryArray(number, length) {
    let binaryString = number.toString(2).padStart(length, '0');
    return binaryString.split('').map(bit => parseInt(bit));
  }

  function updateGridWithTrueBinaryTime() {
    const currentTime = new Date();
    const millisecondsSinceMidnight = currentTime - new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    const fractionOfDayPassed = millisecondsSinceMidnight / (24 * 60 * 60 * 1000);

    // Convert the fraction of the day to a 16-bit binary number
    const dayFractionInBinary = numberToBinaryArray(Math.floor(fractionOfDayPassed * 65536), 16);

    // Define the starting point for the central 4x4 area
    const startRow = 2;
    const startCol = 2;

    // Clear the grid before updating
    led = led.map(row => row.fill(0));

    // Update the grid with this binary number in the central cells
    dayFractionInBinary.forEach((bit, index) => {
      let row = startRow + Math.floor(index / 4);
      let col = startCol + (index % 4);
      led[row][col] = bit * 15; // Assuming 0 is off and 15 is max brightness
    });
    led = rotateGrid(led, 180);
    grid.refresh(led);
  }

  setInterval(updateGridWithTrueBinaryTime, 1318.4); // Refresh rate approximately every 1.3184 seconds

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
