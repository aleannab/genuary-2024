// Created for the #Genuary2024 - Day 16 - Draw 10 000 of something
// https://genuary.art/prompts#jan

let gUnit;
let gSquareUnit;
let gSquares = [];
let gSideCount = 13;

// sm square: 4 triangles
// md square: 16 triangles
// lg square: 64 triangles
//
// total square: 169 lg squares
// total square: 10 816 triangles
//
// 10 000 triangles = 625 md squares
// 816 triangles = 51 md squares
///

let gPalette = ['#e5b061', '#d17746', '#68516a', '#384979', '#6c7ea6', '#b8bbbc'];
let gSquarePalette = [];
function setup() {
  createCanvas((l = min(windowWidth, windowHeight)), l, WEBGL);
  noStroke();

  for (let i = 0; i < 16; i++) {
    gSquarePalette.push(random(gPalette));
  }

  gUnit = width / (4 * gSideCount);
  gSquareUnit = 4 * gUnit;

  let initX = -width / 2;
  let initY = -height / 2;
  for (let i = 0; i < gSideCount; i++) {
    for (let j = 0; j < gSideCount; j++) {
      gSquares.push(new Square(initX + i * gSquareUnit, initY + j * gSquareUnit));
    }
  }
}

function draw() {
  background(100);

  for (let s of gSquares) {
    s.draw();
  }
}

class Square {
  constructor(xp, yp) {
    this.xp = xp + gUnit * 2;
    this.yp = yp + gUnit * 2;
    this.triangles = [];
    this.triangles.push(new Triangle());
  }
  draw() {
    push();
    translate(this.xp, this.yp);
    for (let tri of this.triangles) {
      tri.draw();
    }
    pop();
  }
}

class Triangle {
  constructor() {
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
    let colIndex = 0;
    for (let i = 0; i < 4; i++) {
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
