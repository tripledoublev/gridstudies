import monomeGrid from 'monome-grid';
import rotateGrid from './rotate.js';

async function run() {
  let grid = await monomeGrid();

  let led = new Array(8).fill().map(() => new Array(8).fill(0));

  function decimalToHexadecimal(decimal) {
    return decimal.toString(16).padStart(2, '0').toUpperCase();
  }

  function getHexTime() {
    const now = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const hexMillisecondsPerDay = 0x10 * 0x100 * 0x10;

    // Scale current time to hex time
    const hexMilli = Math.floor((now.getTime() % millisecondsPerDay) / millisecondsPerDay * hexMillisecondsPerDay);

    return {
      hours: Math.floor(hexMilli / (0x100 * 0x10)),
      minutes: Math.floor(hexMilli % (0x100 * 0x10) / 0x10),
      seconds: hexMilli % 0x10
    };
  }

 
  function displayHexDigit(digit, posX, posY) {
    const hexPatterns = {
        '0': [0b0110, 0b1001, 0b1001, 0b0110],
        '1': [0b0010, 0b0110, 0b0010, 0b0010],
        '2': [0b1110, 0b0001, 0b0110, 0b1000],
        '3': [0b1110, 0b0001, 0b0110, 0b1110],
        '4': [0b1000, 0b1000, 0b1111, 0b0001],
        '5': [0b1111, 0b1000, 0b1110, 0b0001],
        '6': [0b0111, 0b1000, 0b1110, 0b0110],
        '7': [0b1111, 0b0001, 0b0010, 0b0100],
        '8': [0b0110, 0b1001, 0b0110, 0b0110],
        '9': [0b0110, 0b0111, 0b0001, 0b0110],
        'A': [0b0110, 0b1001, 0b1111, 0b1001],
        'B': [0b1110, 0b1001, 0b1110, 0b1110],
        'C': [0b0111, 0b1000, 0b1000, 0b0111],
        'D': [0b1110, 0b1001, 0b1001, 0b1110],
        'E': [0b1111, 0b1000, 0b1110, 0b1111],
        'F': [0b1111, 0b1000, 0b1110, 0b1000]
      };
      

    let pattern = hexPatterns[digit];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        let bit = (pattern[y] >> (3 - x)) & 1;
        led[posY + y][posX + x] = bit * 15; // Assume 0 is off, 15 is on
      }
    }
  }

  function updateGridWithTime() {
    const { hours, minutes, seconds } = getHexTime();

    const hexHours = decimalToHexadecimal(hours);
    const hexMinutes = decimalToHexadecimal(minutes);
    //const hexSeconds = decimalToHexadecimal(seconds);

    // Display each hex digit
    displayHexDigit(hexHours[0], 0, 0);
    displayHexDigit(hexHours[1], 4, 0);
    displayHexDigit(hexMinutes[0], 0, 4);
    displayHexDigit(hexMinutes[1], 4, 4);
   // displayHexDigit(hexSeconds[0], 0, 8); // Assuming additional rows for seconds
    //displayHexDigit(hexSeconds[1], 4, 8); // Assuming additional rows for seconds

    led = rotateGrid(led, 180);
    grid.refresh(led);
  }

  setInterval(updateGridWithTime, 1000);

  grid.key((x, y, s) => console.log(`key received: ${x}, ${y}, ${s}`));
}

run();
