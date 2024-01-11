// Created for the #Genuary2024 - In the style of Anni Albers (1899-1994).
// https://genuary.art/prompts#jan11

let gBgSections = [];
let gStripeWidth = 5;
let gStripeCount;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gStripeCount = ceil(windowWidth / (gStripeWidth * 2 + 1));
  gStripeWidth = windowWidth / gStripeCount;
  createBackground();

  noStroke();
}

function createBackground() {
  let avgHeight = height / 6;
  let minHeight = 0.8 * avgHeight;
  let maxHeight = 1.2 * avgHeight;

  let yp = random(minHeight, maxHeight);
  for (let i = 0; i < 4; i++) {
    let sectHeight = random(minHeight, maxHeight);
    gBgSections.push(new Section(yp, sectHeight));

    yp += sectHeight;
  }
}

function createParticles() {}

function draw() {
  background(255);
  for (let sect of gBgSections) {
    sect.draw();
  }
}

class Section {
  constructor(yp, h) {
    this.yp = yp;
    this.h = h;
    this.c = random(0, 200);
    this.stripes = [];
    let xp = 0;
    for (let i = 0; i < gStripeCount; i++) {
      this.stripes.push(xp);
      xp += 2 * gStripeWidth;
    }
  }

  draw() {
    fill(this.c);
    for (let s of this.stripes) {
      rect(s, this.yp, gStripeWidth, this.h);
    }
  }
}
