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
function setup() {
  let isHShorter = windowHeight < windowWidth;
  let w = isHShorter ? (13 * windowHeight) / 12.5 : windowWidth;
  let h = isHShorter ? windowHeight : (13 * windowWidth) / 12.5;
  createCanvas(w, h, WEBGL);
  noStroke();

  for (let i = 0; i < 16; i++) {
    gSquarePalette.push(random(gPalette));
  }

  let l = isHShorter ? width : height;
  gUnit = l / (4 * gSideCount);
  gSquareUnit = 4 * gUnit;

  let initX = -width / 2;
  let initY = -height / 2;

  let missingSquares = Array(gSideCount * gSideCount).fill(true);
  for (let i = 0; i < 51; i++) {
    missingSquares[i] = false;
  }

  shuffle(missingSquares, true);

  for (let i = 0; i < gSideCount; i++) {
    for (let j = 0; j < gSideCount; j++) {
      const isMissingSquare = false; //missingSquares[i * gSideCount + j];
      gTiles.push(new Tile(initX + i * gSquareUnit, initY + j * gSquareUnit, isMissingSquare));
    }
  }
}

function draw() {
  background(100);

  for (let t of gTiles) {
    t.draw();
  }
}

class Tile {
  constructor(xp, yp, isMissingSquare) {
    this.xp = xp + gUnit * 2;
    this.yp = yp + gUnit * 2;
    this.largeSquare = new LargeSquare(isMissingSquare);
  }

  draw() {
    push();
    translate(this.xp, this.yp);
    this.largeSquare.draw();
    pop();
  }
}

class LargeSquare {
  constructor(isMissingSquare) {
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
    this.isMissingSquare = isMissingSquare;
    this.missingSquare = this.isMissingSquare ? int(random(4)) : -1;
    console.log(this.missingSquare);
  }

  draw() {
    push();
    let colIndex = 0;
    // 64 total triangles = 4 * 2 * 8
    for (let i = 0; i < 4; i++) {
      if (i === this.missingSquare) continue;
      push();
      rotate(HALF_PI * i);
      for (let j = 0; j < this.triangles.length; j++) {
        this.drawTri(this.triangles[j], gSquarePalette[colIndex]);
        colIndex = (colIndex + 1) % gSquarePalette.length;
      }
      push();
      scale(-1, 1);
      for (let j = 0; j < this.triangles.length; j++) {
        this.drawTri(this.triangles[j], gSquarePalette[colIndex]);
        colIndex = (colIndex + 1) % gSquarePalette.length;
      }
      pop();
      pop();
    }
    pop();
  }

  drawTri(t, col) {
    fill(col);
    triangle(t[0], t[1], t[2], t[3], t[4], t[5]);
  }
}
