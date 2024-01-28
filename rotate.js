export default function rotateGrid(originalLed, angle) {
    let rotatedLed = new Array(8).fill().map(() => new Array(8).fill(0));
  
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        switch (angle) {
          case 90:
            rotatedLed[x][7 - y] = originalLed[y][x];
            break;
          case 180:
            rotatedLed[7 - y][7 - x] = originalLed[y][x];
            break;
          case 270:
            rotatedLed[7 - x][y] = originalLed[y][x];
            break;
          default:
            // If the angle is not 90, 180, or 270, don't rotate
            rotatedLed[y][x] = originalLed[y][x];
        }
      }
    }
    return rotatedLed;
  }