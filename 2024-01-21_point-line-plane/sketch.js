// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let path = [];
let ellipses = [];
let t = 0;

let minX, maxX, minY, maxY;

function setup() {
  let l = windowWidth > windowHeight ? windowHeight : windowWidth;
  createCanvas(0.9 * l, 0.9 * l);

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
  beginShape();
  let sign = 1;
  let zigZagVal = floor(random(0.25) * ellipses.length);
  for (let i = 0; i < ellipses.length; i++) {
    let xp = ellipses[i].x;
    let yp = ellipses[i].y;
    let val = noise(0.001 * xp, 0.01 * yp);
    let weight = map(val, 0, 1, 1, 30);
    strokeWeight(weight);
    point(xp, yp);

    if (i === zigZagVal) {
      zigZagVal += floor(random(0.2) * ellipses.length);
      let offset = sign * randomGaussian(75, 50);
      sign *= -1;

      // Calculate tangent at the current point
      let tangent = createVector(1, 0);
      tangent.rotate(atan2(yp - ellipses[i - 1].y, xp - ellipses[i - 1].x));

      // Calculate perpendicular vector
      let perpendicular = createVector(-tangent.y, tangent.x);

      // Normalize and apply offset
      perpendicular.normalize();
      perpendicular.mult(offset);

      // Create zig-zag point
      let zigZagPoint = createVector(xp, yp).add(perpendicular);
      zigZagPoint.x = constrain(zigZagPoint.x, minX, maxX);
      zigZagPoint.y = constrain(zigZagPoint.y, minY, maxY);

      vertex(zigZagPoint.x, zigZagPoint.y);
    }
  }
  strokeWeight(1.5);
  endShape();
  pop();
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
