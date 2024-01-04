// Created for the #Genuary2024 -Vera Molnar

let gLineWidthMin = 1;
let gLineWidthMax = 1;
let gStrips = [];
let gStripWidth = 100;
let gStripLengthMax = 500;
let gStripLengthMin = 200;

let gMargin = 50;

let gColor = '#483d51'; //'#7E6B8F';
let gBgColor = '#7E6B8F'; //'#483d51';

function setup() {
  createCanvas(windowWidth, windowHeight);

  gBoundMin = gMargin;
  gBoundMax = height - gMargin - gStripLengthMax;
  noStroke();
  fill(gColor);

  let isLeft = false;
  let inBounds = true;
  let boundX = width - gStripWidth - gMargin;
  console.log(width + ' ' + boundX + ' ' + gStripWidth);
  let x = gMargin;
  while (inBounds) {
    gStrips.push(new Strip(x, gStripWidth, isLeft));
    gStrips.push(new Strip(x, gStripWidth, !isLeft));
    x += gStripWidth * (1 + 0.5 * random(-1, 0));
    isLeft = !isLeft;

    if (x > boundX) {
      break;
    }
  }
}

function mouseClicked() {}

function draw() {
  background(gBgColor);

  for (let strip of gStrips) {
    strip.update();
    strip.draw();
  }
}

class Strip {
  constructor(x, wid, isLeft) {
    let initX = x + random(-1, 1) * wid;
    this.width = wid;
    this.length = random(gStripLengthMin, gStripLengthMax);
    let boundMaxY = height - gMargin - this.length;
    let initY = random(gMargin, boundMaxY);
    this.position = createVector(initX, initY);
    this.hue = gColor;
    this.lineWidth = random(gLineWidthMin, gLineWidthMax);

    this.lineCount = this.length / (2 * this.lineWidth);
    this.isTravelingUp = isLeft;
    this.inc = (isLeft ? -1 : 1) * random(1, 4);

    this.initX = isLeft ? width : -this.wid;

    this.boundCheck = isLeft
      ? function () {
          return this.position.x < -(this.width + this.lineWidth);
        }
      : function () {
          return this.position.x > width;
        };
  }

  update() {
    this.position.x += this.inc;

    if (this.boundCheck()) {
      this.createNewStrip();
    }
  }

  createNewStrip() {
    this.length = random(gStripLengthMin, gStripLengthMax);
    this.lineWidth = random(gLineWidthMin, gLineWidthMax);
    let newX = random(1, 2) * -this.lineWidth;
    let newY = random(gMargin, height - gBoundMax - this.length);
    this.position = createVector(newX, newY);
  }

  draw() {
    let yp = this.position.y;
    for (let i = 0; i < this.lineCount; i++) {
      rect(this.position.x, yp, this.width, this.lineWidth);
      yp += 2 * this.lineWidth;
    }
  }
}
