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
  colorMode(HSB);
  gRowCount = ceil(height / gCharSize);
  gColCount = ceil(width / gCharSize);

  textSize(gCharSize);
  textAlign(CENTER, CENTER);
  frameRate(15); // Adjust frame rate as needed

  for (let i = 0; i < gColCount; i++) {
    let column = [];
    for (let j = 0; j < gRowCount; j++) {
      column.push(0);
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
    drop.update();
    let dropLength = drop.length;
    if (drop.isVert) {
      let col = drop.col;
      let charIndex = 0;
      let rowStart = drop.row;
      for (let i = 0; i < dropLength; i++) {
        // check current box
        let row = (rowStart + i) % gRowCount;
        let current = gASCII[col][row];
        let newIndex = current + charIndex;
        if (newIndex > density.length) newIndex = density.length - 1;
        gASCII[col][row] = newIndex;
        charIndex++;
      }
    } else {
      let row = drop.row;
      let charIndex = 0;
      let colStart = drop.col;
      for (let i = 0; i < dropLength; i++) {
        // check current box
        let col = (colStart + i) % gColCount;
        let current = gASCII[col][row];
        let newIndex = current + charIndex;
        if (newIndex > density.length) newIndex = density.length - 1;
        gASCII[col][row] = newIndex;
        charIndex++;
      }
    }
  }
}

function resetGrid() {
  for (let i = 0; i < gColCount; i++) {
    for (let j = 0; j < gRowCount; j++) {
      gASCII[i][j] = 0;
    }
  }
}

function draw() {
  update();

  background(0);
  for (let i = 0; i < gColCount; i++) {
    for (let j = 0; j < gRowCount; j++) {
      let index = gASCII[i][j];
      text(density.charAt(index), (i + 0.5) * gCharSize, (j + 0.5) * gCharSize);
    }
  }
}

class ASCIIPixel {
  constructor() {
    this.value = 0;
    this.color = color(0);
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
