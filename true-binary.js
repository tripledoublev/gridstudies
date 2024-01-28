import monomeGrid from 'monome-grid';

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

    // Update the grid with this binary number
    dayFractionInBinary.forEach((bit, index) => {
      let row = Math.floor(index / 8);
      let col = index % 8;
      led[row][col] = bit * 15; // Assuming 0 is off and 15 is max brightness
    });

    grid.refresh(led);
  }

  setInterval(updateGridWithTrueBinaryTime, 1318.4); // Refresh rate approximately every 1.3184 seconds

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
