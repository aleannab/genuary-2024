// Created for the #Genuary2024 - Day 9 - ASCII
// https://genuary.art/prompts#jan9

const density = ' ♥Genuary-Day9-ASCII♥'; // .:-=+*#%@';

let gRowCount, gColCount;
let gCharSize = 35; // Adjust the scale for ASCII character size

let gIncX, gIncY;

let gASCII = [];
let gDrops = [];

let gColorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  gRowCount = ceil(height / gCharSize);
  gColCount = ceil(width / gCharSize);

  textSize(gCharSize);
  textAlign(CENTER, CENTER);
  frameRate(15);

  gColorPalette = generateColorPalette(random(0, 360));

  for (let i = 0; i < gColCount; i++) {
    let col = [];
    for (let j = 0; j < gRowCount; j++) {
      col.push(new ASCIIPixel());
    }
    gASCII.push(col);
  }

  for (let i = 0; i < gColCount; i++) {
    if (getRandBool()) continue;
    let dropCount = ceil(random(0, 15));

    let isVert = getRandBool();
    let isNeg = getRandBool();
    for (let j = 0; j < dropCount; j++) {
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
    let index = (startIndex + drop.dir * i) % incrementIndex;
    if (index < 0) index = isVertical ? gRowCount + index : gColCount + index;
    let currentVal = isVertical ? gASCII[drop.col][index].value : gASCII[index][drop.row].value;
    let newVal = currentVal + i + drop.charOffset;
    newVal = (newVal < 0 ? density.length - newVal : newVal) % density.length;

    if (isVertical) {
      gASCII[drop.col][index].updateColor(dropColor, currentVal / newVal);
      gASCII[drop.col][index].value = newVal;
    } else {
      gASCII[index][drop.row].updateColor(dropColor, currentVal / newVal);
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

  updateColor(mixColor, amount) {
    this.color = this.value === 0 ? mixColor : lerpColor(this.color, mixColor, amount);
  }
}

class Drop {
  constructor(col, row, isVert, isNeg) {
    this.col = col;
    this.row = row;
    this.tracker = isVert ? row : col;
    this.isVert = isVert;
    this.length = floor(random(0, density.length));
    let speed = random(0.5, 1);
    this.dir = isNeg ? -1 : 1;
    this.v = this.dir * speed;
    this.hue = random(0, 360);
    let randColor = random(gColorPalette);
    this.color = color(randColor[0], randColor[1], randColor[2]);
    this.charOffset = floor(random(0, 0.5 * density.length));
  }

  update() {
    this.tracker = this.tracker + this.v;
    if (this.isVert) {
      let newRow = floor(this.tracker);
      if (newRow < 0) newRow = gRowCount + newRow;
      this.row = newRow % gRowCount;
    } else {
      let newCol = floor(this.tracker);
      if (newCol < 0) newCol = gColCount + newCol;
      this.col = newCol % gColCount;
    }
  }
}

function generateColorPalette(baseHue) {
  // Analogous colors (baseHue - 30 degrees, baseHue + 30 degrees)
  let analogousHue1 = (baseHue - 40 + 360) % 360;
  let analogousHue2 = (baseHue + 40) % 360;
  let analogousHue3 = (baseHue - 80 + 360) % 360;
  let analogousHue4 = (baseHue + 80) % 360;

  // Convert HSL to RGB
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Convert hues to RGB
  let analogousColor1 = hslToRgb(analogousHue1, random(80, 100), random(20, 40));
  let analogousColor2 = hslToRgb(analogousHue2, random(60, 80), random(40, 60));
  let analogousColor3 = hslToRgb(analogousHue3, random(40, 60), random(60, 80));
  let analogousColor4 = hslToRgb(analogousHue4, random(20, 40), random(80, 100));

  return [analogousColor1, analogousColor2, analogousColor3, analogousColor4];
}
