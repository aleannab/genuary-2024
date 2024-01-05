// Created for the #Genuary2024 -Vera Molnar
// https://genuary.art/prompts#jan5

let gLineSpacing = 1.5;

let gStrips = [];
let gStripWidth;
let gStripLength;

let gMarginX;
let gMarginY;
let gBoundMinY;
let gBoundMaxY;

let gColor = '#1d643cb4';
let gBgColor = '#d8d3cf';

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(1.5 * windowHeight, windowHeight);
  } else {
    createCanvas(windowWidth, windowWidth / 1.5);
  }
  strokeWeight(2);

  gMarginY = 0.1 * height;
  gMarginX = 2 * gMarginY;
  gStripLength = (height - 2 * gMarginY) * 0.6;
  gStripWidth = 0.138 * gStripLength;

  gBoundMinY = gMarginY;
  gBoundMaxY = height - gMarginY - gStripLength;

  let isLeft = false;
  let x = gMarginX;
  let count = 1.2 * ceil((width - 2 * gMarginX) / gStripWidth);

  let stripWidthVar = 0.5 * gStripWidth;

  for (let i = 0; i < count; i++) {
    let countVert = 3;
    for (let j = 0; j < countVert; j++) {
      gStrips.push(new Strip(x + random(-1, 1) * stripWidthVar, isLeft));
    }

    x += gStripWidth * random(0.8, 1.2);
    isLeft = !isLeft;
  }
}

function draw() {
  background(gBgColor);

  stroke(gColor);
  for (let strip of gStrips) {
    strip.update();
    strip.draw();
  }

  fill(gBgColor);
  noStroke();
  rect(0, 0, gMarginX, height);
  rect(width - gMarginX, 0, gMarginX, height);
  console.log(frameRate());
}

class Strip {
  constructor(x, isLeft) {
    let initX = x;
    let boundMaxY = height - gMarginY - gStripLength;
    let initY = random(gMarginY, boundMaxY);
    this.position = createVector(initX, initY);

    this.lineCount = gStripLength / gLineSpacing;
    this.isTravelingLeft = isLeft;
    this.inc = (isLeft ? -1 : 1) * random(0.5, 2);

    this.initX = isLeft ? width : -gStripWidth;

    this.boundCheck = isLeft
      ? function () {
          return this.position.x < gMarginX - gStripWidth;
        }
      : function () {
          return this.position.x > width - gMarginX;
        };

    this.yPositions = [];
    let yp = this.position.y;
    for (let i = 0; i < this.lineCount; i++) {
      this.yPositions.push(yp);
      yp += gLineSpacing;
    }
  }

  update() {
    this.position.x += this.inc;

    if (this.boundCheck()) {
      this.createNewStrip();
    }
  }

  createNewStrip() {
    this.lineCount = gStripLength / gLineSpacing;
    let newX = this.isTravelingLeft ? width - gMarginX : gMarginX - gStripWidth;
    let newY = random(gMarginY, height - gMarginY - gStripLength);
    this.position = createVector(newX, newY);

    this.yPositions = [];
    let yp = this.position.y;
    for (let i = 0; i < this.lineCount; i++) {
      this.yPositions.push(yp);
      yp += gLineSpacing;
    }
  }

  draw() {
    let xPos = this.position.x;

    beginShape(LINES);
    for (let i = 0; i < this.yPositions.length; i += 2) {
      vertex(xPos, this.yPositions[i]);
      vertex(xPos + gStripWidth, this.yPositions[i]);
    }
    endShape();
  }
}
