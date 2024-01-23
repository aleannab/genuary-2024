// Created for the #Genuary2024 - Day 18/27 - Bahaus. Code for one hour. At the one hour mark, you're done.
// https://genuary.art/prompts#jan

let gPalette = ['#d3312a', '#d48a46', '#ebc649', '##717544', '#0a6ea2', '#894781'];

let gBgColor = '#f1ece4';

let gScale = 0.05;
let gScaleMax = 0.3;

let gConstraints = {
  lineMin: 0.005,
  lineMax: 0.01,
  circMin: 0.1,
  circMax: 0.3,
  arcMin: 0.05,
  arcMax: 0.1,
};
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  rectMode(CENTER);
  frameRate(1);

  background(gBgColor);
  strokeWeight(3);
  // frameRate(1);
  // drawCircle();
  drawCheckers();
  // drawArcs(0);
}

function draw() {
  if (gScale > 0.5) return;
  let randVal = floor(random(5));
  switch (randVal) {
    case 0:
      drawLines();
      break;
    case 1:
      drawCircle();
      break;
    case 2:
      drawArcs();
      break;
    case 3:
      drawRect();
      break;
    case 4:
      drawCheckers();
      break;
  }
  gScale += random(0.01, 0.05);
}

function drawLines() {
  noFill();
  setRandStroke();
  push();
  randTransform();
  let length = random(0.2, 0.5) * width;

  drawLine(length);
  push();
  translate(0, -random(0.05) * length);
  randRotate(false, QUARTER_PI);

  drawLine(length);
  pop();
  pop();
}

function drawLine(length) {
  line(0, 0, length, 0);
  push();
  let perpLineCount = getRandBool() ? 1 : 2;
  let perp = random(0.5, 0.9) * length;
  for (let i = 0; i < perpLineCount; i++) {
    line(perp, -20, perp, 20);
    perp += random(0.01, 0.08) * length;
  }

  pop();
}

function drawRect() {
  getRandBool() ? fill(0) : setRandFill();
  push();
  randTransform();
  noStroke();
  let length = random(0.2, 0.5) * width;
  let scale = map(gScale, 0, gScaleMax, gConstraints.lineMin, gConstraints.lineMax) * width;
  rect(0, 0, length, scale);

  // if (getRandBool()) {
  //   if (getRandBool()) {
  //     let num = floor(random(1, 4));
  //     for (let i = 0; i < num; i++) {}
  //   } else {

  //   }
  // }
  pop();
}

function drawCheckers() {
  let d = map(gScale, 0, gScaleMax, 0.001, 0.05) * width;

  randTransform();

  let iCount = floor(random(3, 6));
  let jCount = floor(random(2, 8));

  for (let i = 0; i < iCount - 1; i++) {
    for (let j = 0; j < jCount - 1; j++) {
      let xp = (i + 0.5) * d;
      let yp = (j + 0.5) * d;

      let col = random(gPalette);

      fill(col);
      noStroke();
      rect(xp, yp, d, d);
    }
  }
  setRandStroke();
  for (let i = 0; i < iCount; i++) {
    let xp = i * d;
    line(xp, 10 * d * random(0.5, 1.5), xp, -10 * d * random(0.5, 1.5));
  }

  for (let j = 0; j < jCount; j++) {
    let yp = d * j;
    line(10 * d * random(0.5, 1.5), yp, -10 * d * random(0.5, 1.5), yp);
  }
}

function drawCircle() {
  if (getRandBool()) {
    setRandStroke(20);
  } else {
    noStroke();
  }
  push();
  randTransform();
  let d = map(gScale, 0, gScaleMax, 0.01, 0.1) * width;
  if (getRandBool()) {
    noStroke();
    let c = random(gPalette);
    fill(hue(c), saturation(c), brightness(c), 0.5);
    circle(0, 0, random(2, 3) * d);
    fill(0);
    circle(0, 0, random(1, 2) * d);
  }
  setRandFill();

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
  randRotate(getRandBool(0.4));
}

function randTranslate() {
  let xp = random(0.2, 0.8) * width;
  let yp = random(0.2, 0.8) * height;
  translate(xp, yp);
  console.log(width + ': ' + xp);
  console.log(height + ': ' + yp);
}

function randRotate(isRight = true, max = TWO_PI) {
  let angle = isRight ? floor(0, 4) * PI : random(max);
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
  return random() < odds;
}
