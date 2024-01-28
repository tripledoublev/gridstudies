import monomeGrid from 'monome-grid';

async function run() {
  let grid = await monomeGrid(); // Optionally pass in grid identifier

  // Initialize 2-dimensional LED array
  let led = [];
  for (let y = 0; y < 8; y++) {
    led[y] = [];
    for (let x = 0; x < 8; x++) {
      led[y][x] = 0;
    }
  }

  let counter = 0;
  let quadrant = 0;
  let maxCount = 15; // Since we have a 4x4 grid in each quadrant

  // Function to fill the spiral in the current quadrant
  function fillSpiral(counter, quadrant) {
    if (counter === 0) {
      if (quadrant === 0) {
        // Reset the LEDs only at the start of the first quadrant
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            led[y][x] = 0;
          }
        }
      }
    }

    // Calculate quadrant offsets
    let offsetX = (quadrant % 2) * 4;
    let offsetY = Math.floor(quadrant / 2) * 4;

    let startRow = 0, startCol = 0;
    let endRow = 3, endCol = 3;
    let currentCount = -1; // Start from -1 to include the first LED in the sequence

    while (startRow <= endRow && startCol <= endCol) {
      for (let i = startCol; i <= endCol; ++i, ++currentCount) {
        if (currentCount === counter) {
          led[startRow + offsetY][i + offsetX] = 15; // Light up the current LED
          // Special case for the first LED in each quadrant
          if (i == startCol && startRow == 0 && counter == 0) {
            led[startRow + offsetY][i + offsetX + 1] = 15; // Light up the second LED
            currentCount++;
          }
          return;
        }
      }
      startRow++;

      for (let i = startRow; i <= endRow; ++i, ++currentCount) {
        if (currentCount === counter) {
          led[i + offsetY][endCol + offsetX] = 15;
          return;
        }
      }
      endCol--;

      if (startRow <= endRow) {
        for (let i = endCol; i >= startCol; --i, ++currentCount) {
          if (currentCount === counter) {
            led[endRow + offsetY][i + offsetX] = 15;
            return;
          }
        }
        endRow--;
      }

      if (startCol <= endCol) {
        for (let i = endRow; i >= startRow; --i, ++currentCount) {
          if (currentCount === counter) {
            led[i + offsetY][startCol + offsetX] = 15;
            return;
          }
        }
        startCol++;
      }
    }
  }

 // Refresh LEDs with a spiral pattern
 let refresh = function() {
  let currentTime = new Date();
  let seconds = currentTime.getSeconds();
  let counter = seconds % maxCount; // Current second within the 15-second span
  let quadrant = Math.floor(seconds / 15); // Determine the current quadrant

  fillSpiral(counter, quadrant); // Update the current LED in the spiral
  grid.refresh(led);
}

  // Call refresh() function 60 times per second
  setInterval(refresh, 1000);

  // Set up key handler
  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
