// Created for the #Genuary2024 - Day 18/27 - Bahaus. Code for one hour. At the one hour mark, you're done.
// https://genuary.art/prompts#jan

let gPalette = ['#d3312a', '#d48a46', '#ebc649', '##717544', '#0a6ea2', '#894781'];

let gScale = 0.05;
let gScaleMax = 0.3;

let gConstraints = {
  lineMin: 0.05,
  lineMax: 0.1,
  circMin: 0.1,
  circMax: 0.3,
  arcMin: 0.05,
  arcMax: 0.1,
};
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  rectMode(CENTER);

  background(1);
  strokeWeight(3);
  frameRate(2);
  drawCircle();
  drawLine();
  drawArcs(0);
}

function draw() {
  if (gScale > 0.5) return;
  let randVal = floor(random(3));
  switch (randVal) {
    case 0:
      drawLine();
      break;
    case 1:
      drawCircle();
      break;
    case 2:
      drawArcs();
      break;
  }
  gScale += random(0.01, 0.05);
}

function drawLine() {
  getRandBool() ? fill(0) : setRandFill();
  push();
  randTransform();
  rect(0, 0, random(0.2, 0.5) * width, 50 * gScale + 3);
  pop();
}

function drawCircle() {
  if (getRandBool()) {
    setRandStroke();
  } else {
    noStroke();
  }
  push();
  randTransform();
  setRandFill();
  let d = map(gScale, 0, gScaleMax, 0.01, 0.1) * width;
  circle(0, 0, d);
  pop();
}

function drawArcs(x = -1) {
  push();
  randTransform();
  setRandStroke();
  getRandBool() ? fill(1) : noFill();

  let d = map(gScale, 0, 1, gConstraints.arcMin, gConstraints.arcMax) * width;
  let numArcs = getRandBool() ? 1 : floor(random(3, 5));
  let xp = 0;
  for (let i = 0; i < numArcs; i++) {
    arc(xp, 0, d, d, PI, TWO_PI, OPEN);
    xp += d;
  }

  if (getRandBool()) {
    let length = random(0.1) * width;
    let r = d / 2;
    line(-r - length, 0, xp - r + length, 0);
  }
  pop();
}

function randTransform() {
  randTranslate();
  randRotate(getRandBool(0.3));
}

function randTranslate() {
  translate(random(0.2, 0.8) * width, random(0.2, 0.8) * height);
}

function randRotate(isRight = false) {
  let angle = isRight ? floor(0, 4) * PI : random(TWO_PI);
  rotate(angle);
}

function setRandFill() {
  fill(random(gPalette));
}

function setRandStroke(max = 2) {
  stroke(0);
  strokeWeight(random(1, max));
}

function getRandBool(odds = 0.5) {
  return random() > odds;
}
