// Created for the #Genuary2024 - Day 10 - Hexagonal
// https://genuary.art/prompts#jan10

let gHexagons = [];
let gColCount, gRowCount;
let gOffsetX, gOffsetY;
const gHexSize = 100;
let xOffset, yOffset;
let gLastTime;
let gTransformTime = 150;

let gColorPalette = ['#ffc800', '#0019FF', '#FF005E', '#ffffff'];
let gAlpha = 0.33;
let gStrokeWeight = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  gColCount = ceil(width / gHexSize);
  gRowCount = ceil(height / gHexSize);

  gOffsetX = (3 / 2) * gHexSize;
  gOffsetY = sqrt(3) * gHexSize;

  for (let i = 0; i < gRowCount; i++) {
    let rows = [];
    for (let j = 0; j < gColCount; j++) {
      let x = j * gOffsetX;
      let y = i * gOffsetY;
      if (j % 2 !== 0) {
        y += gOffsetY / 2;
      }
      let newHex = new Hexagon(x, y, gHexSize);
      rows.push(newHex);
    }
    gHexagons.push(rows);
  }
  gLastTime = millis();

  strokeWeight(gStrokeWeight);
  let adjColors = [];
  for (let c of gColorPalette) {
    let col = color(c);
    adjColors.push(color(red(col), green(col), blue(col), gAlpha));
  }
  gColorPalette = adjColors;
}

function update(dt) {
  for (let row of gHexagons) {
    for (let hex of row) {
      hex.update(dt);
    }
  }
}

function draw() {
  background(255);

  let curTime = millis();
  let dt = 0.01 * (curTime - gLastTime);
  gLastTime = curTime;

  update(dt);

  for (let row of gHexagons) {
    for (let hex of row) {
      hex.draw(true);
    }
  }
  for (let row of gHexagons) {
    for (let hex of row) {
      hex.draw(false);
    }
  }
}

function drawHexes(isFill) {
  for (let row of gHexagons) {
    for (let hex of row) {
      hex.draw(isFill);
    }
  }
}

class Hexagon {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    let c = random(gColorPalette); //(random(0, 360), 100, 100, 0.5);
    this.color = color(red(c), green(c), blue(c), gAlpha * 255);
    this.angle = 0; //random(0, PI / 3);
    this.scale = 1; //random(1, 2);
    this.targetScaleMax = ceil(random(0, 4)) * 1; //random(1.5, 2); //random(1.0, 2.0);
    this.targetScaleMin = 1; //random(0.5, 1.0);

    this.angularVel = PI / gTransformTime; //random(0, PI / 32); // Rotate by 30 degrees (π/6 radians) per second
    this.growRate = (this.targetScaleMax - this.targetScaleMin) / gTransformTime; //0.005; // Adjust this rate based on your preference

    this.isGrowing = true;
  }

  update(dt) {
    let inc = this.isGrowing ? this.growRate : -this.growRate;
    this.scale = this.scale + inc * dt;
    if (this.scale >= this.targetScaleMax || this.scale <= this.targetScaleMin) {
      this.isGrowing = !this.isGrowing;
    }
    this.angle = this.angle + this.angularVel * dt;
  }

  draw(isFill) {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    if (isFill) {
      fill(this.color);
      noStroke();
    } else {
      noFill();
      stroke(0);
    }

    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = (TWO_PI / 6) * i;
      let hx = this.size * cos(angle) * this.scale;
      let hy = this.size * sin(angle) * this.scale;
      vertex(hx, hy);
    }
    endShape(CLOSE);

    pop();
  }
}
