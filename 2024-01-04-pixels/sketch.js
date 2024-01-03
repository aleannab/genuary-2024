let gRowCount, gColCount;
let gPixelSize = 50;
let gCurrentGen, gNextGen;
let gIsRandMode = false;
let gSameColor;
let gRateMin = 1;
let gRateMax = 5;

let gTimeoutActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gRowCount = ceil(height / gPixelSize);
  gColCount = ceil(width / gPixelSize);

  gCurrentGen = createGrid(gRowCount, gColCount);
  gNextGen = createGrid(gRowCount, gColCount);

  colorMode(HSB);
  noStroke();

  gSameColor = random(0, 360);
}

function draw() {
  if (!gTimeoutActive) {
    for (let pixel of gCurrentGen) {
      fill(pixel.curHue, 100, 100);
      rect(pixel.x, pixel.y, gPixelSize, gPixelSize);
    }

    let allCloseEnough = true;
    for (let i = 0; i < gRowCount; i++) {
      for (let j = 0; j < gColCount; j++) {
        let closeEnough = updateColor(gCurrentGen, i, j);
        if (allCloseEnough && !closeEnough) {
          allCloseEnough = false;
        }
      }
    }

    if (allCloseEnough) {
      gTimeoutActive = true;
      let waitTime = gIsRandMode ? 500 : 1000;
      setTimeout(toggleMode, waitTime);
    }

    gCurrentGen = [...gNextGen];
  }
}

function toggleMode() {
  gIsRandMode = !gIsRandMode;
  if (gIsRandMode) {
    for (let pixel of gCurrentGen) {
      pixel.update();
    }
  } else {
    gSameColor = random(0, 360);
  }

  gTimeoutActive = false;
}

function updateColor(grid, x, y) {
  let index = x * gColCount + y;
  let pixel = grid[index];
  let target = gIsRandMode ? pixel.targetHue : gSameColor;

  let inc = (pixel.curHue > target ? -1 : 1) * pixel.rate;
  let isCloseEnough = abs(pixel.curHue - target) < 15;
  if (!isCloseEnough) grid[index].curHue += inc;
  return isCloseEnough;
}

function createGrid(gRowCount, gColCount) {
  let grid = [];
  for (let i = 0; i < gRowCount; i++) {
    for (let j = 0; j < gColCount; j++) {
      let x = j * gPixelSize;
      let y = i * gPixelSize;
      grid.push(new Pixel(x, y));
    }
  }
  return grid;
}

class Pixel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.curHue = random(0, 360);
    this.targetHue = 0;
    this.rate = random(gRateMin, gRateMax);
  }

  update() {
    let newHue = this.targetHue + random(0, 360);
    if (newHue < 360) newHue = 360 - newHue;
    this.targetHue = newHue % 360;
    this.rate = random(gRateMin, gRateMax);
  }
}
