import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid(); // optionally pass in grid identifier

    // initialize 2-dimensional led array
    let led = [];
    for (let y = 0; y < 8; y++) {
      led[y] = [];
      for (let x = 0; x < 8; x++)
        led[y][x] = 0;
    }

  let counter = 0;
  let maxCount = 64; // Since we have an 8x8 grid

   // Function to fill the spiral
   function fillSpiral() {
    // Only reset the LEDs if the counter has reached its maximum value
    if (counter === 0) {
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          led[y][x] = 0;
        }
      }
    }


    let startRow = 0, startCol = 0;
    let endRow = 7, endCol = 7;
    let currentCount = 0;
    while (startRow <= endRow && startCol <= endCol) {
      for (let i = startCol; i <= endCol; ++i, ++currentCount) {
        if (currentCount === counter) {
          led[startRow][i] = 15; // Light up the current LED
          return; // Exit the function after lighting up the current LED
        }
      }
      startRow++;

      for (let i = startRow; i <= endRow; ++i, ++currentCount) {
        if (currentCount === counter) {
          led[i][endCol] = 15;
          return;
        }
      }
      endCol--;

      if (startRow <= endRow) {
        for (let i = endCol; i >= startCol; --i, ++currentCount) {
          if (currentCount === counter) {
            led[endRow][i] = 15;
            return;
          }
        }
        endRow--;
      }

      if (startCol <= endCol) {
        for (let i = endRow; i >= startRow; --i, ++currentCount) {
          if (currentCount === counter) {
            led[i][startCol] = 15;
            return;
          }
        }
        startCol++;
      }
    }
  }

    // Refresh LEDs with a spiral pattern
    let refresh = function() {
      if (counter === maxCount - 1) {
        fillSpiral(); // Reset the spiral when it completes
      } else {
        fillSpiral(); // Update the current LED in the spiral
      }
      grid.refresh(led);
      counter = (counter + 1) % maxCount; // Increment counter and loop back after reaching maxCount
    }
  // call refresh() function 60 times per second
  setInterval(refresh, 1000);

  // set up key handler
  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
