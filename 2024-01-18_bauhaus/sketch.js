// Created for the #Genuary2024 - Day 18 - Bauhaus.
// https://genuary.art/prompts#jan18
//
// Inspired by Vasily Kandinsky's 𝘒𝘰𝘮𝘱𝘰𝘴𝘪𝘵𝘪𝘰𝘯 8, 1923

let gPalette = ['#d3312a', '#d48a46', '#ebc649', '#0a6ea2', '#894781'];

let gBgColor = '#f1ece4';

let gUnit;

let gSections = [];

function setup() {
  let isWidthBigger = windowWidth > windowHeight;
  let w = isWidthBigger ? 1.42 * windowHeight : windowWidth;
  let h = isWidthBigger ? windowHeight : 0.7 * windowWidth;
  createCanvas(0.9 * w, 0.9 * h);
  colorMode(HSB, 1);
  rectMode(CENTER);
  let minL = min(w, h);
  gUnit = minL / 3;

  drawAll();
}

function drawAll() {
  background(gBgColor);
  placeObjectsRandomly(5, 12, 1); //rects

  placeObjectsRandomly(0, 5, 1.5); //grid
  placeObjectsRadially(1, 13, 0.5); //circles

  placeObjectsRadially(3, 7, 1); // line
  placeObjectsRadially(1, 5, 0.8); //circles
  placeObjectsRadially(4, 3, 0.5); //arcs
}

function mouseClicked() {
  drawAll();
}

function drawElement(pos, type, scale) {
  switch (type) {
    case 0:
      drawGrid(pos, scale);
      break;
    case 1:
      drawCircle(pos, scale);
      break;
    case 2:
      drawAngle(pos, scale);
      break;
    case 3:
      drawLine(pos, scale);
      break;
    case 4:
      drawArcs(pos, scale);
      break;
    case 5:
      drawRect(pos, scale);
      break;
  }
}

function placeObjectsRadially(type, num, scale) {
  let aInc = TWO_PI / num;
  for (let i = 0; i < num; i++) {
    let r = random(0.3, 0.4);
    if (i % 2 === 0) r *= random(0.3, 0.5);
    let x = cos(aInc * i + random()) * r * width + width / 2;
    let y = sin(aInc * i + random()) * r * height + height / 2;
    let pos = createVector(x, y);
    drawElement(pos, type, random(0.8, 1.5) * scale);
  }
}

function placeObjectsRandomly(type, num, scale) {
  for (let i = 0; i < num; i++) {
    let xp = random(0.2, 0.8) * width;
    let yp = random(0.2, 0.8) * height;
    let pos = createVector(xp, yp);
    drawElement(pos, type, random(0.8, 1.5) * scale);
  }
}

function drawLine(pos, scale) {
  setRandStroke(1.5);
  push();
  translate(pos.x, pos.y);
  randRotate(true);
  let length = random(0.8, 1.2) * scale * gUnit;
  line(-length / 2, 0, length / 2, 0);
  push();
  let perpLineCount = getRandBool() ? 1 : 2;
  let perp = random(-0.5, 0.3) * length;
  for (let i = 0; i < perpLineCount; i++) {
    line(perp, -20, perp, 20);
    perp += random(0.01, 0.08) * length;
  }
  pop();
  pop();
}

function drawRect(pos, scale) {
  getRandBool() ? fill(0) : setRandFill();
  push();
  translate(pos.x, pos.y);
  randRotate(false);
  noStroke();
  let length = scale * random(0.25, 1) * gUnit;
  let w = random(0.03, 0.05) * gUnit;
  rect(0, 0, length, w);
  pop();
}

function drawGrid(pos, scale) {
  push();
  translate(pos.x, pos.y);
  randRotate(false);

  let iCount = floor(random(3, 4));
  let jCount = floor(random(2, 5));

  setRandStroke();

  let inc = random(0.07, 0.08) * gUnit * scale;
  let length = max(iCount, jCount) * inc * random(1, 3);

  for (let i = 0; i < iCount - 1; i++) {
    for (let j = 0; j < jCount - 1; j++) {
      let xp = (i + 0.5) * inc;
      let yp = (j + 0.5) * inc;
      fill(random(gPalette));
      rect(xp, yp, inc, inc);
    }
  }
  let vLength = random(0.5, 1) * length;
  let vOffset = floor(random(iCount)) * inc;
  for (let i = 0; i < iCount; i++) {
    let xp = i * inc;
    let l = random(0.95, 1) * vLength;
    stroke(0);
    line(xp, -vOffset, xp, l - vOffset);
  }

  let hLength = random(0.5, 1) * length;
  let hOffset = floor(random(jCount)) * inc;
  for (let i = 0; i < jCount; i++) {
    let yp = i * inc + 0;
    let l = random(0.95, 1) * hLength;
    stroke(0);
    line(-hOffset, yp, l + hOffset, yp);
  }

  pop();
}

function drawCircle(pos, scale) {
  push();
  translate(pos.x, pos.y);
  let d = random(0.3, 0.5) * gUnit * scale;

  let isTwo = getRandBool(0.5);
  if (isTwo) {
    let c = random(gPalette);
    noStroke();
    fill(hue(c), saturation(c), brightness(c), 0.5);
  } else {
    setRandStroke(10);
    fill(random(gPalette));
  }

  circle(0, 0, d);
  if (getRandBool(0.1)) {
    let c = random(gPalette);
    setRandStroke();
    fill(random(gPalette));
    circle(0, 0, random(0.3, 0.6) * d);
  }
  pop();
}

function drawArcs(pos, scale) {
  push();
  translate(pos.x, pos.y);
  randRotate(true);
  setRandStroke();
  getRandBool() ? fill(1) : noFill();

  let d = random(0.2, 0.5) * scale * gUnit;
  let numArcs = floor(random(3, 5));
  if (getRandBool()) {
    noFill();
    for (let i = 0; i < numArcs; i++) {
      let offset = 2 * d;
      push();
      translate(random(offset), random(offset));
      arc(0, 0, d, d, PI, TWO_PI, OPEN);
      pop();
    }
  } else {
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
  }

  pop();
}

function randTransform(isRight = false) {
  randTranslate();
  randRotate(isRight);
}

function randTranslate() {
  let xp = random(0.2, 0.8) * width;
  let yp = random(0.2, 0.8) * height;
  translate(xp, yp);
}

function randRotate(isRight = true, max = TWO_PI) {
  let angle = isRight ? floor(random(0, 4)) * HALF_PI : floor(random(0, 4)) * QUARTER_PI;
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
