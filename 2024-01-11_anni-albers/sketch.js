// Created for the #Genuary2024 - In the style of Anni Albers (1899-1994).
// https://genuary.art/prompts#jan11
// Inspired by Anni Albers, Dotted, 1959

let gBgSections = [];
let gStripeWidth = 6;
let gStripeSpacing = 7;
let gStripeInc;
let gStripeCount;
let gStitchInc = 5;

let gKnotSections = [];
let gKnotRad = 5;

let gColorPalette = ['#342417', '#6f5754', '#be7775', '#cc471f', '#ceb273'];
let gBgColor = '#fceed9';
let gKnotPalette = [...gColorPalette, gBgColor];

function setup() {
  createCanvas(windowHeight * 0.5, windowHeight);
  colorMode(HSB);

  gStripeCount = ceil((width + gStripeSpacing) / (gStripeWidth + gStripeSpacing));
  gStripeWidth = (width + gStripeSpacing) / gStripeCount - gStripeSpacing;
  gStripeInc = gStripeWidth + gStripeSpacing;

  createBackground();
}

function createBackground() {
  let sectionCount = 7;
  let avgHeight = height / sectionCount;
  let minHeight = 0.8 * avgHeight;
  let maxHeight = 1.2 * avgHeight;

  let yp = 0;
  for (let i = 0; i < sectionCount - 1; i++) {
    let sectHeight = random(minHeight, maxHeight);
    gBgSections.push(new Section(yp, sectHeight, i != 0, i === 1 || i === sectionCount - 2));
    yp += sectHeight;
  }

  gBgSections.push(new Section(yp, height - yp));

  let knotSectSpacing = width / 3;

  xp = knotSectSpacing / 2;
  for (let i = 0; i < 3; i++) {
    gKnotSections.push(new KnotSection(xp));
    xp += knotSectSpacing;
  }
}

function draw() {
  background(gBgColor);

  noStroke();
  for (let sect of gBgSections) {
    sect.draw();
  }

  for (let knotSect of gKnotSections) {
    knotSect.draw();
  }
}

class Section {
  constructor(yp, h, hasStripes, isDark = false) {
    this.randSeed = yp * h;
    this.yp = yp;
    this.h = h;
    this.c = random(gColorPalette); //isDark ? gColorPalette[0] : gColorPalette[floor(random(1, gColorPalette.length))];
    this.rows = [];
    let rowCount = ceil(h / gStitchInc);
    let stitchHeight = h / rowCount;
    for (let i = 0; i < rowCount; i++) {
      this.rows.push(new Row(yp, this.c, stitchHeight, hasStripes));
      yp += stitchHeight;
    }
  }

  draw() {
    for (let r of this.rows) {
      r.draw();
    }
  }
}

class Row {
  constructor(yp, c, h, hasStripes) {
    this.yp = yp;
    this.stitches = [];

    let threadCount = (2 * width) / gStripeInc;
    let xp = 0;
    for (let i = 0; i < threadCount; i++) {
      let isEven = i % 2 === 0;
      let w = isEven ? gStripeWidth : gStripeSpacing;
      let stitchCol = hasStripes && isEven ? c : gBgColor;
      this.stitches.push(new Stitch(createVector(xp, yp), w, h, stitchCol, isEven));
      xp += w;
    }
  }
  draw() {
    for (let s of this.stitches) {
      s.draw();
    }
  }
}

class Stitch {
  constructor(pos, w, h, c, isEven) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    let bScalar = isEven ? 1.0 : 0.9;
    this.color = color(hue(c), saturation(c) + random(-2, 2), bScalar * (brightness(c) + random(-2, 2)), 0.6);
  }

  draw() {
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.w, this.h + 5);
  }
}

class KnotSection {
  constructor(xp) {
    this.knots = [];
    let yp = 0.05 * height;
    let yInc = gKnotRad * 1.5; //0.75;
    let numDots = (0.9 * height) / yInc;
    let gMargin = 0.05 * width; // 4 * gKnotRad;
    for (let i = 0; i < numDots; i++) {
      let offset = randomGaussian(cos(0.01 * yp), 40);
      let newX = constrain(xp + offset, gMargin + random(0, 30), width - (gMargin + random(0, 50)));
      this.knots.push(new Knot(newX, yp));
      yp += yInc;
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
