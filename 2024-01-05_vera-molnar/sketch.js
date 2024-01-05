// Created for the #Genuary2024 -Vera Molnar
// https://genuary.art/prompts#jan5

let gLineSpacing = 1.5;

let gStrips = [];
let gStripWidth;
let gStripPosVar;
let gStripLength;

let gMarginX;
let gMarginY;

let gInitLevels = [];

let gOffsetY;

let gColor = '#1d643cb4';
let gBgColor = '#d8d3cf';

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(1.5 * windowHeight, windowHeight);
  } else {
    createCanvas(windowWidth, windowWidth / 1.5);
  }

  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);

  gMarginY = 0.1 * height;
  gMarginX = 0.1 * width;
  gStripLength = (height - 2 * gMarginY) * 0.6;
  gStripWidth = 0.138 * gStripLength;

  gStripPosVar = 0.1 * gStripWidth;

  let spaceTopStart = height - 2 * gMarginY - gStripLength;
  let startInc = spaceTopStart / 3;
  gInitLevels = [gMarginY, gMarginY + startInc, gMarginY + 2 * startInc, gMarginY + 3 * startInc];

  let isLeft = false;
  let x = gMarginX;
  let count = 1.2 * ceil((width - 2 * gMarginX) / gStripWidth);

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < 3; j++) {
      gStrips.push(new Strip(x, isLeft, j));
      isLeft = !isLeft;
    }
    x += gStripWidth * random(0.9, 1.1);
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
  constructor(x, isLeft, level) {
    let initX = x + random(-gStripPosVar, gStripPosVar);

    this.boundMinY = gInitLevels[level];
    this.boundMaxY = gInitLevels[level + 1];

    let initY = random(this.boundMinY, this.boundMaxY);
    this.position = createVector(initX, initY);

    this.lineCount = gStripLength / gLineSpacing;
    this.isTravelingLeft = isLeft;
    this.inc = (isLeft ? -1 : 1) * random(1, 3);
    this.spawnX = this.isTravelingLeft ? width - gMarginX : gMarginX - gStripWidth;

    this.boundCheck = isLeft
      ? function () {
          return this.position.x < gMarginX - gStripWidth;
        }
      : function () {
          return this.position.x > width - gMarginX;
        };

    this.level = level;

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
    let newX = this.spawnX;
    let newY = random(this.boundMinY, this.boundMaxY);
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
