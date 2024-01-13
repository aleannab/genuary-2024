// Created for the #Genuary2024 - In the style of Anni Albers (1899-1994).
// https://genuary.art/prompts#jan11

let gBgSections = [];
const gSectionCount = 5;
let gStripeWidth = 10;
let gStripeSpacing = 9;
let gStripeInc;
let gStripeCount;

let gVertThreads = [];
let gHorizThreads = [];
let gVertThreadSpacing = 5;

let gThreadSpacing = 3;

let gKnotSections = [];
let gKnotRad = 5;

let gColorPalette = ['#342417', '#6f5754', '#be7775', '#cc471f', '#b07d55'];
let gBgColor = '#d3b9a2';
let gThreadColor = '#c9ae94';
let gKnotPalette;

function setup() {
  createCanvas(windowHeight * 0.5, windowHeight);
  colorMode(HSB);

  gStripeCount = ceil((width + gStripeSpacing) / (gStripeWidth + gStripeSpacing));
  gStripeWidth = (width + gStripeSpacing) / gStripeCount - gStripeSpacing;
  gStripeInc = gStripeWidth + gStripeSpacing;

  gKnotPalette = [...gColorPalette, gBgColor];
  createBackground();
}

function createBackground() {
  let avgHeight = height / 7;
  let minHeight = 0.8 * avgHeight;
  let maxHeight = 1.2 * avgHeight;

  let threadCount = height / gVertThreadSpacing;
  let yp = 0;
  for (let i = 0; i < threadCount; i++) {
    gVertThreads.push(yp);
    yp += random(0.5, 1.5) * gVertThreadSpacing;
  }

  threadCount = (2 * width) / gStripeInc;
  let xp = 0;
  for (let i = 0; i < threadCount; i++) {
    gHorizThreads.push(xp);
    xp += i % 2 === 0 ? gStripeWidth : gStripeSpacing;
  }

  yp = random(minHeight, maxHeight);
  for (let i = 0; i < 5; i++) {
    let sectHeight = random(minHeight, maxHeight);
    gBgSections.push(new Section(yp, sectHeight, i === 0 || i === 4));
    yp += sectHeight;
  }

  let knotSectSpacing = width / 3;

  xp = knotSectSpacing / 2;
  for (let i = 0; i < 3; i++) {
    gKnotSections.push(new KnotSection(xp));
    xp += knotSectSpacing;
  }
}

function createParticles() {}

function draw() {
  background(gBgColor);

  stroke(gThreadColor);
  strokeWeight(2);
  for (let t of gVertThreads) {
    line(0, t, width, t);
  }
  strokeWeight(1);
  for (let t of gHorizThreads) {
    line(t, 0, t, height);
  }

  for (let sect of gBgSections) {
    sect.draw();
  }

  noStroke();
  for (let knotSect of gKnotSections) {
    knotSect.draw();
  }
}

class Section {
  constructor(yp, h, topOrBottom) {
    this.randSeed = yp * h;
    this.yp = yp;
    this.h = h;
    this.c = topOrBottom ? gColorPalette[0] : gColorPalette[floor(random(1, gColorPalette.length))];
    this.sCol = color(hue(this.c), saturation(this.c), 0.8 * brightness(this.c));
    this.stripes = [];
    this.threads = [];
    let xp = 0;
    for (let i = 0; i < gStripeCount; i++) {
      this.stripes.push(xp);
      xp += gStripeInc;
    }

    let threadCount = h / gThreadSpacing;

    for (let i = 0; i < threadCount; i++) {
      this.threads.push(yp);
      yp += gThreadSpacing;
    }
  }

  draw() {
    randomSeed(this.randSeed);

    strokeWeight(1);
    stroke(this.sCol);
    fill(this.c);
    for (let t of this.threads) {
      line(0, t, width, t);
    }
    for (let s of this.stripes) {
      rect(s, this.yp + random(-2, 2), gStripeWidth, this.h);
    }

    stroke(gBgColor);
    strokeWeight(0.5);
    for (let t of this.threads) {
      line(0, t, width, t);
    }
  }
}

class KnotSection {
  constructor(xp) {
    this.knots = [];
    let yp = 0;
    let yInc = gKnotRad; // * 0.75;
    let numDots = height / yInc;
    let mag = width / 10;
    let gMargin = 0.05 * width; // 4 * gKnotRad;
    for (let i = 0; i < numDots; i++) {
      let offset = randomGaussian(mag * cos(0.01 * yp), 50);
      let newX = constrain(xp + offset, gMargin, width - gMargin);
      this.addKnot(newX, yp);
      yp += yInc;
    }
  }

  addKnot(xp, yp) {
    let collision = false;

    for (let existingKnot of this.knots) {
      let d = dist(xp, yp, existingKnot.pos.x, existingKnot.pos.y);
      if (d < gKnotRad * 2) {
        collision = true;
        break;
      }
    }

    if (collision) {
      this.addKnot(xp + random(-10, 10), yp + random(-10, 10));
    } else {
      this.knots.push(new Knot(xp, yp));
    }
  }

  draw() {
    for (let knot of this.knots) {
      knot.draw();
    }
  }
}

class Knot {
  constructor(xp, yp) {
    this.randSeed = xp * yp;
    this.c = random(0, 1) > 0.7 ? gKnotPalette[0] : random(gKnotPalette);
    this.pos = createVector(xp, yp);
    this.vertices = [];
    let offset = 0.5 * gKnotRad;
    let vCount = 5;
    let angleInc = 360 / vCount;

    for (let i = 0; i < vCount; i++) {
      let angle = radians(angleInc * i);
      let adjRad = gKnotRad + random(0, offset);
      let xp = adjRad * cos(angle);
      let yp = adjRad * sin(angle);
      this.vertices.push(createVector(xp, yp));
    }
  }

  draw() {
    randomSeed(this.randSeed);
    strokeWeight(4);
    stroke(this.c);
    noFill();
    push();
    translate(this.pos.x, this.pos.y);
    for (let i = 0; i < 50; i++) {
      stroke(hue(this.c), saturation(this.c) + random(-5, 5), brightness(this.c) + random(-10, 10));
      let v0 = random(this.vertices);
      let v1 = random(this.vertices);
      line(v0.x, v0.y, v1.x, v1.y);
    }
    pop();
  }
}
