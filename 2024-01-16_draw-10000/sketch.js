// Created for the #Genuary2024 - Day 16 - Draw 10 000 of something
// https://genuary.art/prompts#jan

let gUnit;
let gSquareUnit;
let gTiles = [];
let gSideCount = 13;

// sm square: 4 triangles
// md square: 16 triangles
// lg square: 64 triangles

let gPalette = ['#e5b061', '#d17746', '#68516a', '#384979', '#6c7ea6', '#b8bbbc'];
let gSquarePalette = [];
let gBgColor;
function setup() {
  let isHShorter = windowHeight < windowWidth;
  let w = isHShorter ? (13 * windowHeight) / 12.5 : windowWidth;
  let h = isHShorter ? windowHeight : (13 * windowWidth) / 12.5;
  createCanvas(w, h, WEBGL);
  rectMode(CENTER);
  noStroke();

  for (let i = 0; i < 16; i++) {
    gSquarePalette.push(random(gPalette)); //[idx]);
  }

  gBgColor = random(gSquarePalette);

  let l = isHShorter ? width : height;
  gUnit = l / (4 * gSideCount);
  gSquareUnit = 4 * gUnit;

  let initX = -width / 2;
  let initY = -height / 2;

  for (let i = 0; i < gSideCount; i++) {
    for (let j = 0; j < gSideCount; j++) {
      gTiles.push(new Tile(initX + i * gSquareUnit, initY + j * gSquareUnit));
    }
  }

  background(255);

  for (let t of gTiles) {
    t.draw();
  }

  drawCorners();
}

function drawCorners() {
  fill(255);

  const leftX = -width / 2;
  const rightX = width / 2;
  const topY = -height / 2;
  const bottomY = height / 2;
  const topLeft = { x: leftX, y: topY, z: 0 };
  const topRight = { x: rightX, y: topY, z: 0 };
  const bottomLeft = { x: leftX, y: bottomY, z: 0 };
  const bottomRight = { x: rightX, y: bottomY, z: 0 };

  drawBox(topLeft, true);
  drawBox(topRight, false);
  drawBox(bottomLeft, true);
  drawBox(bottomRight, false);
}

function drawBox(position) {
  const s = 1.5 * gSquareUnit;
  const offset = (s + gUnit) / 2;
  push();
  translate(position.x, position.y, position.z);
  const leftX = -offset;
  const rightX = offset;
  rect(0, 0, s);
  rect(leftX, offset, gUnit);
  rect(leftX, -offset, gUnit);
  rect(rightX, offset, gUnit);
  rect(rightX, -offset, gUnit);

  rect(0, offset, 2 * gUnit, gUnit);
  rect(0, -offset, 2 * gUnit, gUnit);
  rect(rightX, 0, gUnit, 2 * gUnit);
  rect(leftX, 0, gUnit, 2 * gUnit);
  pop();
}

class Tile {
  constructor(xp, yp) {
    this.xp = xp + gUnit * 2;
    this.yp = yp + gUnit * 2;
    this.largeSquare = new LargeSquare();
  }

  draw() {
    push();
    translate(this.xp, this.yp);
    this.largeSquare.draw();
    pop();
  }
}

class LargeSquare {
  constructor() {
    // one large square = 4 medium squares
    // this array of triangles draws half a medium square = 8 triangles
    this.triangles = [
      [0, -2 * gUnit, gUnit, -2 * gUnit, gUnit, -gUnit],
      [0, -gUnit, gUnit, -gUnit, 0.5 * gUnit, -0.5 * gUnit],
      [0, -gUnit, 0.5 * gUnit, -1.5 * gUnit, gUnit, -gUnit],
      [0, -gUnit, 0, -2 * gUnit, 0.5 * gUnit, -1.5 * gUnit],
      [0, 0, 0, -gUnit, 0.5 * gUnit, -0.5 * gUnit],
      [gUnit, -gUnit, gUnit, -2 * gUnit, 0.5 * gUnit, -1.5 * gUnit],
      [gUnit, -gUnit, gUnit, -2 * gUnit, 1.5 * gUnit, -1.5 * gUnit],
      [2 * gUnit, -2 * gUnit, gUnit, -2 * gUnit, 1.5 * gUnit, -1.5 * gUnit],
    ];
  }

  draw() {
    push();
    // 64 total triangles = 4 * 2 * 8
    for (let i = 0; i < 4; i++) {
      let isEven = i % 2 === 0;
      let colIndex = isEven ? 0 : 4 % gSquarePalette.length;
      let inc = isEven ? 1 : -1;

      push();
      rotate(HALF_PI * i);
      for (let j = 0; j < this.triangles.length; j++) {
        this.drawTri(this.triangles[j], gSquarePalette[colIndex]);
        colIndex = this.getNextColor(colIndex, inc);
      }

      push();
      rotate(HALF_PI);
      scale(-1, 1);
      for (let j = 0; j < this.triangles.length; j++) {
        this.drawTri(this.triangles[j], gSquarePalette[colIndex]);
        colIndex = this.getNextColor(colIndex, inc);
      }
      pop();
      pop();
    }
    pop();
  }

  getNextColor(i, inc) {
    let next = i + inc;
    if (next < 0) {
      next = gSquarePalette.length + next;
    }
    return next % gSquarePalette.length;
  }

  drawTri(t, col) {
    fill(col);
    triangle(t[0], t[1], t[2], t[3], t[4], t[5]);
  }
}
