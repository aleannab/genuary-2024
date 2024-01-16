// Created for the #Genuary2024 - Wobbly Function
// https://genuary.art/prompts#jan13

let gLines = [];
let gPalette = [];

let gMidY;
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  gMidY = height;

  noStroke();

  let hue = random(0, 360);
  gPalette = [color(hue, 20, 10), color(hue, 8, 95), color(hue, 10, 75)];

  gPalette = shuffle(gPalette);
  gBgColor = gPalette.pop();
  createLines();
}

function draw() {
  background(gBgColor);

  let dt = millis() - gMillisStart;

  let isEven = false;
  for (let line of gLines) {
    let offset = isEven ? 0 : PI;
    line.update(dt * 0.0005 + offset);
    line.draw();
    isEven = !isEven;
  }
}

function createLines() {
  gLines = [];
  let count = 2;
  let amp = 0.85 * height;
  let ampInc = amp / (count + 1);
  gPalette = shuffle(gPalette);
  for (let i = 0; i < count; i++) {
    gLines.push(new Line(amp, gPalette[i % gPalette.length]));
    amp -= ampInc;
  }
  gMillisStart = millis();
}

class Line {
  constructor(amp, col) {
    this.points = [];
    let xp = 0;
    let count = floor(random(40, 50));
    let inc = width / count;
    this.amp = amp;
    this.spaceFreq0 = random(0.3, 0.7);
    this.spaceFreq1 = this.spaceFreq0 + random(-0.3, 0.3);
    this.timeFreq0 = random(0.5, 1.0);
    this.timeFreq1 = random(0.5, 1.0);

    for (let i = 0; i < count + 1; i++) {
      this.points.push(new Point(xp, i === 0 || i === count, amp));
      xp += inc;
    }

    this.firstPoint = this.points[0];
    this.lastPoint = this.points[count];
    this.color = col;
  }

  update(t) {
    for (let point of this.points) {
      point.pos.x = point.endX;
      point.pos.y =
        gMidY * 0.5 +
        this.amp *
          sin(this.spaceFreq0 * point.pos.x - this.timeFreq0 * t + 1 + 1.5 * sin(this.spaceFreq1 * point.pos.x + this.timeFreq1 * t + 5) ** 3);
    }
  }

  draw() {
    fill(this.color);
    beginShape();
    vertex(this.firstPoint.pos.x, this.firstPoint.pos.y);
    for (let point of this.points) {
      curveVertex(point.pos.x, point.pos.y);
    }
    vertex(this.lastPoint.pos.x, this.lastPoint.pos.y);
    endShape();
  }
}

class Point {
  constructor(xp, isStatic, amp) {
    this.pos = createVector(0, gMidY);
    this.endX = xp;
    this.amp = amp;
    this.offset = random(0, TWO_PI);
    this.isStatic = isStatic;
  }
}
