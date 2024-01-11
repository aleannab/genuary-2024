// Created for the #Genuary2024 - In the style of Anni Albers (1899-1994).
// https://genuary.art/prompts#jan11

let gBgSections = [];
const gSectionCount = 5;
let gStripeWidth = 5;
let gStripeSpacing = 6;
let gStripeInc;
let gStripeCount;

let gThreads = [];
let gThreadSpacing = 3;

let gKnots = [];
let gKnotRad;

let gColorPalette = ['#342417', '#6f5754', '#be7775', '#cc471f', '#b07d55'];
let gBgColor = '#cea996';
let gThreadColor = '#a5876c';
let gKnotPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gStripeCount = ceil((windowWidth + gStripeSpacing) / (gStripeWidth + gStripeSpacing));
  gStripeWidth = (windowWidth + gStripeSpacing) / gStripeCount - gStripeSpacing;
  gStripeInc = gStripeWidth + gStripeSpacing;
  gKnotRad = 1.2 * gStripeWidth;

  gKnotPalette = [...gColorPalette, gBgColor];
  createBackground();

  strokeWeight(0.5);
}

function createBackground() {
  let avgHeight = height / 7;
  let minHeight = 0.8 * avgHeight;
  let maxHeight = 1.2 * avgHeight;

  let threadCount = height / gThreadSpacing;
  let yp = 0;
  for (let i = 0; i < threadCount; i++) {
    gThreads.push(yp);
    yp += gThreadSpacing;
  }

  yp = random(minHeight, maxHeight);
  for (let i = 0; i < 5; i++) {
    let sectHeight = random(minHeight, maxHeight);
    gBgSections.push(new Section(yp, sectHeight));

    yp += sectHeight;
  }

  for (let i = 0; i < 500; i++) {
    gKnots.push(new Knot());
  }
}

function createParticles() {}

function draw() {
  background(gBgColor);

  stroke(gThreadColor);
  for (let t of gThreads) {
    line(0, t, width, t);
  }

  for (let sect of gBgSections) {
    sect.draw();
  }

  noStroke();
  for (let knot of gKnots) {
    knot.draw();
  }
}

class Section {
  constructor(yp, h) {
    this.yp = yp;
    this.h = h;
    this.c = random(gColorPalette);
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
    noStroke();
    fill(this.c);
    for (let s of this.stripes) {
      rect(s, this.yp, gStripeWidth, this.h);
    }

    stroke(gBgColor);
    for (let t of this.threads) {
      line(0, t, width, t);
    }
  }
}

class Knot {
  constructor() {
    this.c = random(gKnotPalette);
    this.pos = createVector(random(0, width), random(0, height));
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
    //noStroke();
    fill(this.c);
    push();
    translate(this.pos.x, this.pos.y);
    //circle(0, 0, 20, 20);
    beginShape();
    for (let v of this.vertices) {
      curveVertex(v.x, v.y);
    }
    endShape(CLOSE);
    pop();
  }
}
