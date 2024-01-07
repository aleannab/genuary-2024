// Created for the #Genuary2024 - Day 6 - Screensaver
// https://genuary.art/prompts#jan6
//
// Inspired by the classic Windows screensaver Mystify

let gShapes = [];
let gBoundX, gBoundY, gBoundZ;

let gPalette = ['#00db96', '#9600ff', '#90dcff', '#e10086', '#fdfb76'];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);

  gBoundX = width;
  gBoundY = height;
  gBoundZ = 0.6 * width;

  strokeWeight(10);
  smooth();
  noFill();

  for (let i = 0; i < gPalette.length; i++) {
    gShapes.push(new Shape(gPalette[i]));
  }
}

function draw() {
  background(0);
  push();
  translate(0, 0, -0.5 * width);
  rotateY(0.00005 * millis());
  for (let shape of gShapes) {
    shape.update();
    shape.draw();
  }
  pop();
}

class Shape {
  constructor(color) {
    this.points = [];
    this.color = color;

    for (let i = 0; i < 4; i++) {
      this.points.push(new Point());
    }
  }

  update() {
    for (let point of this.points) {
      point.update();
    }
  }

  draw() {
    stroke(this.color);
    beginShape();
    for (let point of this.points) {
      vertex(point.pos.x, point.pos.y, point.pos.z);
    }
    endShape(CLOSE);
  }
}

class Point {
  constructor() {
    this.pos = createVector(random(-gBoundX, gBoundX), random(-gBoundY, gBoundY), random(-gBoundZ, gBoundZ));
    this.vel = createVector(random(-1, 1), random(-1, 1), random(-1, 1)).mult(10);
  }

  update(t) {
    this.pos = this.pos.add(this.vel);
    this.checkBounds();
  }

  checkBounds() {
    if (this.pos.x > gBoundX || this.pos.x < -gBoundX) this.vel.x = -this.vel.x;
    if (this.pos.y > gBoundY || this.pos.y < -gBoundY) this.vel.y = -this.vel.y;
    if (this.pos.z > gBoundZ || this.pos.z < -gBoundZ) this.vel.z = -this.vel.z;
  }
}
