import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid();

  // Initialize LED array
  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  function numberToBinaryArray(number, length) {
    let binaryString = number.toString(2).padStart(length, '0');
    return binaryString.split('').map(bit => parseInt(bit));
  }

  function updateGridWithTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Convert to binary and update the grid
    const binaryHours = numberToBinaryArray(hours, 6);
    const binaryMinutes = numberToBinaryArray(minutes, 6);
    const binarySeconds = numberToBinaryArray(seconds, 6);

    // Assume rows 1, 3, and 5 for hours, minutes, and seconds respectively
    [binaryHours, binaryMinutes, binarySeconds].forEach((timeComponent, index) => {
      let row = index * 2 + 1;
      timeComponent.forEach((bit, col) => {
        led[row][col] = bit * 15; // Assuming 0 is off and 15 is max brightness
      });
    });

    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000);

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
