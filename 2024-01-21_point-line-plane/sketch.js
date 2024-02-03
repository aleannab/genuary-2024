// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let gCurvyLinePath = [];
let gZigZagPath = [];

let gMin, gMax;

function setup() {
  let l = windowWidth > windowHeight ? windowHeight : windowWidth;
  createCanvas(0.9 * l, 0.9 * l);
  noFill();

  gMin = createVector(0.1 * width, 0.2 * height);
  gMax = createVector(0.9 * width, 0.8 * height);
  noiseDetail(1, 0.25);

  createNewSketch();
}

function draw() {
  background(255);
  for (let cPt of gCurvyLinePath) {
    let val = noise(0.001 * cPt.x, 0.01 * cPt.y);
    let weight = map(val, 0, 1, 2, 30);
    strokeWeight(weight);
    point(cPt.x, cPt.y);
  }

  beginShape();
  strokeWeight(1.5);
  for (let zPoint of gZigZagPath) {
    vertex(zPoint.x, zPoint.y);
  }
  endShape();
}

function mouseClicked() {
  createNewSketch();
}

function createNewSketch() {
  let path = createPath();
  createCurvyLine(path);
  createZigZag();
}

function createPath() {
  let path = [];
  let count = 50;
  let inc = (0.8 * width) / (count - 1);
  path.push(createVector(gMin.x + random(0.1, 0.5) * width, gMax.y));
  path.push(createVector(gMin.x, random(gMin.y, gMax.y)));
  for (let i = 1; i < count; i++) {
    if (random() > 0.7) continue;
    let xp = constrain(i * inc + 0.25 * width * random(-1, 1), gMin.x, gMax.x);
    path.push(createVector(xp, random(gMin.y, gMax.y)));
  }
  path.push(createVector(gMax.x, gMin.y));
  return path;
}

function createCurvyLine(path) {
  gCurvyLinePath = [];
  let eCount = 3000;
  let eInc = 1 / eCount;
  for (let i = 0; i < eCount; i++) {
    let pt = getPointOnBezier(i * eInc, path);
    gCurvyLinePath.push(pt);
  }
}

function createZigZag() {
  gZigZagPath = [];
  let zzIndex = floor(random(0.5) * gCurvyLinePath.length);
  let sign = 1;
  for (let i = 0; i < 10; i++) {
    if (zzIndex >= gCurvyLinePath.length) break;
    let xp = gCurvyLinePath[zzIndex].x;
    let yp = gCurvyLinePath[zzIndex].y;

    let offset = sign * randomGaussian(height / 5, 30);

    let tangent = createVector(1, 0);
    tangent.rotate(atan2(yp - gCurvyLinePath[zzIndex - 1].y, xp - gCurvyLinePath[zzIndex - 1].x));

    let perpendicular = createVector(-tangent.y, tangent.x);
    perpendicular.normalize();
    perpendicular.mult(offset);

    let zzPt = createVector(xp, yp).add(perpendicular);
    zzPt.x = constrain(zzPt.x, gMin.x, gMax.x);
    zzPt.y = constrain(zzPt.y, gMin.y, gMax.y);

    gZigZagPath.push(zzPt);
    zzIndex += floor(random(0.05, 0.2) * gCurvyLinePath.length);
    sign *= -1;
  }
}

// Following functions made with ChatGPT
function getPointOnBezier(t, points) {
  let n = points.length - 1;
  let x = 0;
  let y = 0;

  for (let i = 0; i <= n; i++) {
    let term = bernstein(n, i, t);
    x += points[i].x * term;
    y += points[i].y * term;
  }

  return createVector(x, y);
}

function bernstein(n, i, t) {
  return binomialCoefficient(n, i) * pow(t, i) * pow(1 - t, n - i);
}

function binomialCoefficient(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
