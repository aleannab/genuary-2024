// Created for the #Genuary2024 - Day 9 - ASCII
// https://genuary.art/prompts#jan9

//const density = '@%#*+=-:. ';
const density = ' .:-=+*#%@';

let gRowCount, gColCount;
let gCharSize = 20; // Adjust the scale for ASCII character size

let gIncX, gIncY;

let gASCII = [];
let gDrops = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  gRowCount = ceil(height / gCharSize);
  gColCount = ceil(width / gCharSize);

  textSize(gCharSize);
  textAlign(CENTER, CENTER);
  frameRate(15); // Adjust frame rate as needed

  for (let i = 0; i < gColCount; i++) {
    let column = [];
    for (let j = 0; j < gRowCount; j++) {
      column.push(new ASCIIPixel());
    }
    gASCII.push(column);
  }

  for (let i = 0; i < gColCount; i++) {
    let dropCount = ceil(random(0, 5));
    for (let j = 0; j < dropCount; j++) {
      let isVert = getRandBool();
      let isNeg = getRandBool();
      gDrops.push(new Drop(i, floor(random(0, gRowCount)), isVert, isNeg));
    }
  }
  fill(255);
}

function getRandBool() {
  return random(0, 1) > 0.5;
}

function update() {
  resetGrid();
  for (let drop of gDrops) {
    if (drop.isVert) {
      updateDrop(drop, true);
    } else {
      updateDrop(drop, false);
    }
  }
}

function updateDrop(drop, isVertical) {
  drop.update();
  const dropLength = drop.length;
  const dropColor = drop.color;

  const startIndex = isVertical ? drop.row : drop.col;
  const incrementIndex = isVertical ? gRowCount : gColCount;

  for (let i = 0; i < dropLength; i++) {
    let index = (startIndex + i) % incrementIndex;
    let currentVal = isVertical ? gASCII[drop.col][index].value : gASCII[index][drop.row].value;
    let newVal = currentVal + i;
    newVal = newVal > density.length ? density.length - 1 : newVal;

    if (isVertical) {
      gASCII[drop.col][index].updateColor(dropColor);
      gASCII[drop.col][index].value = newVal;
    } else {
      gASCII[index][drop.row].updateColor(dropColor);
      gASCII[index][drop.row].value = newVal;
    }
  }
}

function resetGrid() {
  for (let i = 0; i < gColCount; i++) {
    for (let j = 0; j < gRowCount; j++) {
      gASCII[i][j].value = 0;
    }
  }
}

function draw() {
  update();

  background(0);
  for (let i = 0; i < gColCount; i++) {
    for (let j = 0; j < gRowCount; j++) {
      let index = gASCII[i][j].value;
      let color = gASCII[i][j].color;
      fill(color);
      text(density.charAt(index), (i + 0.5) * gCharSize, (j + 0.5) * gCharSize);
    }
  }
}

class ASCIIPixel {
  constructor() {
    this.value = 0;
    this.color = color(0);
  }

  updateColor(mixColor) {
    this.color = this.value === 0 ? mixColor : lerpColor(mixColor, this.color, 0.5);
  }
}

class Drop {
  constructor(col, row, isVert, isNeg) {
    this.col = col;
    this.row = row;
    this.isVert = isVert;
    this.length = density.length;
    let speed = ceil(random(0, 3));
    this.v = isNeg ? -speed : speed;
    this.hue = random(0, 360);
    this.color = color(this.hue, 100, 100);
  }

  update() {
    if (this.isVert) {
      let newRow = this.row + this.v;
      if (newRow < 0) newRow = gRowCount + newRow;
      this.row = newRow % gRowCount;
    } else {
      let newCol = this.col + this.v;
      if (newCol < 0) newCol = gColCount + newCol;
      this.col = newCol % gColCount;
    }
  }
}
