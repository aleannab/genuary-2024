// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let path = [];
let ellipses = [];
let zigZagPoints = [];
let t = 0;

let minX, maxX, minY, maxY;

function setup() {
  let l = windowWidth > windowHeight ? windowHeight : windowWidth;
  createCanvas(0.9 * l, 0.9 * l);

  noFill();
  stroke(0);

  let marginX = 0.1 * width;
  minX = marginX;
  maxX = width - marginX;

  let marginY = 0.2 * height;
  minY = marginY;
  maxY = height - marginY;

  // Define a wavy bezier path
  let count = 50;
  let inc = (0.8 * width) / (count - 1);

  path.push(createVector(minX + random(0.1, 0.5) * width, maxY));
  path.push(createVector(minX, random(minY, maxY)));
  for (let i = 1; i < count; i++) {
    if (random() > 0.7) continue;
    let xp = constrain(i * inc + 0.25 * width * random(-1, 1), minX, maxX);
    path.push(createVector(xp, random(minY, maxY)));
  }
  path.push(createVector(maxX, minY));

  // Generate ellipses along the path
  let eCount = 3000;
  let eInc = 1 / eCount;
  for (let i = 0; i < eCount; i++) {
    let pt = getPointOnBezier(i * eInc, path);
    ellipses.push(pt);
  }

  // Calculate zigzag points
  let zigZagIndex = floor(random(0.5) * ellipses.length);
  let zigZagCount = 10;
  let sign = 1;
  for (let i = 0; i < zigZagCount; i++) {
    if (zigZagIndex >= ellipses.length) break;
    let xp = ellipses[zigZagIndex].x;
    let yp = ellipses[zigZagIndex].y;

    let offset = sign * randomGaussian(height / 5, 30); // randomGaussian(10, 50);

    // Calculate tangent at the current point
    let tangent = createVector(1, 0);
    tangent.rotate(atan2(yp - ellipses[zigZagIndex - 1].y, xp - ellipses[zigZagIndex - 1].x));

    // Calculate perpendicular vector
    let perpendicular = createVector(-tangent.y, tangent.x);

    // Normalize and apply offset
    perpendicular.normalize();
    perpendicular.mult(offset);

    // Create zig-zag point
    let zigZagPoint = createVector(xp, yp).add(perpendicular);
    zigZagPoint.x = constrain(zigZagPoint.x, minX, maxX);
    zigZagPoint.y = constrain(zigZagPoint.y, minY, maxY);

    zigZagPoints.push(zigZagPoint);
    zigZagIndex += floor(random(0.05, 0.2) * ellipses.length);
    sign *= -1;
  }
}

function draw() {
  randomSeed(0);
  background(255);
  noFill();
  stroke(0);

  // Draw the wavy bezier path
  // beginShape();
  // for (let i = 0; i < path.length; i++) {
  //   vertex(path[i].x, path[i].y);
  // }
  // endShape();

  // Draw ellipses along the path
  fill(0);
  noFill();
  strokeWeight(2);
  noiseDetail(1, 0.25);
  for (let i = 0; i < ellipses.length; i++) {
    let xp = ellipses[i].x;
    let yp = ellipses[i].y;
    let val = noise(0.001 * xp, 0.01 * yp);
    let weight = map(val, 0, 1, 2, 30);
    strokeWeight(weight);
    point(xp, yp);
  }

  beginShape();
  strokeWeight(1.5);
  for (let zPoint of zigZagPoints) {
    vertex(zPoint.x, zPoint.y);
  }
  endShape();
}

// Function to get a point on the wavy bezier path given a parameter t
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

// Function to calculate the derivative of a cubic Bezier curve at a specific parameter t
function getTangentOnBezier(t, points) {
  let mt = 1 - t;
  let mt2 = mt * mt;
  let t2 = t * t;

  let tangentX = -3 * mt2 * points[0].x + 3 * (mt2 - 2 * t * mt) * points[1].x + 3 * (2 * t * mt - t2) * points[2].x + 3 * t2 * points[3].x;
  let tangentY = -3 * mt2 * points[0].y + 3 * (mt2 - 2 * t * mt) * points[1].y + 3 * (2 * t * mt - t2) * points[2].y + 3 * t2 * points[3].y;

  return createVector(tangentX, tangentY).normalize();
}

// Bernstein basis function
function bernstein(n, i, t) {
  return binomialCoefficient(n, i) * pow(t, i) * pow(1 - t, n - i);
}

// Binomial coefficient function
function binomialCoefficient(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// Factorial function
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
