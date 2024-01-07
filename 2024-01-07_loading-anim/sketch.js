// Created for the #Genuary2024 -Progress bar / indicator / loading animation.
// https://genuary.art/prompts#jan7

let gLines = [];

let gMidY;

let gDuration = 5000;
let gDurationReset = 100;
let gMillisStart;

let gIsRestarting = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  strokeWeight(10);
  gMidY = 0.5 * height;
  let count = 10;
  let ampMin = 10;
  let amp = count * ampMin;
  let ampInc = amp / count;
  for (let i = 0; i < count; i++) {
    gLines.push(new Line(amp));
    amp -= ampInc;
  }
  gMillisStart = millis();
}

function draw() {
  background(255);

  let t = millis() - gMillisStart;

  let dur = gIsRestarting ? gDurationReset : gDuration;
  let complete = sin(t / dur) + 1;
  if (complete >= 2) gIsRestarting = !gIsRestarting;

  for (let line of gLines) {
    line.update(t * 0.01, complete);
    line.draw();
  }
}

class Line {
  constructor(amp) {
    this.points = [];
    let xp = 0;
    let count = floor(random(5, 10));
    let inc = width / count;
    for (let i = 0; i < count + 1; i++) {
      this.points.push(new Point(xp, i === 0 || i === count, amp));
      xp += inc;
    }

    this.firstPoint = this.points[0];
    this.lastPoint = this.points[count];
    this.color = color(random(0, 360), 100, 100);
  }

  update(t, complete) {
    for (let point of this.points) {
      point.update(t, complete);
    }
  }

  draw() {
    stroke(this.color);
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
    this.pos = createVector(xp, gMidY);
    this.amp = amp;
    this.offset = random(0, TWO_PI);
    this.isStatic = isStatic;
    console.log(isStatic + ' ' + xp + ' ' + width);
  }

  update(t, complete) {
    if (this.isStatic) return;
    let curAmp = map(complete, 0, 1, this.amp, 0);
    this.pos.y = gMidY + curAmp * sin(t + this.offset);
  }
}
