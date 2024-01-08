// Created for the #Genuary2024 -Progress bar / indicator / loading animation.
// https://genuary.art/prompts#jan7

let gLines = [];

let gMidY;

let gDuration = 5000;
let gDurationReset = 100;
let gMillisStart;

let gIsLoading = true;

let gHoldTime = 2000;
let gClearX;

let gBgColor = '#ffffff';
let gPalette = ['#d9ead3', '#a2c4c9', '#6fa8dc', '#3d85c6', '#0b5394'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  gMidY = 0.5 * height;

  startLoading();
}

function draw() {
  if (gIsLoading) {
    background(gBgColor);

    let dt = millis() - gMillisStart;

    let complete = min(dt / gDuration, 1);
    if (complete === 1) {
      gIsLoading = false;
    }

    for (let line of gLines) {
      line.update(dt * 0.01, complete);
      line.draw();
    }
  } else {
    fill(gBgColor);
    noStroke();
    rect(-0.3 * width, 0, gClearX, height);
    gClearX += 10;
    if (gClearX > 1.3 * width) {
      startLoading();
    }
  }
  console.log(frameRate());
}

function startLoading() {
  strokeWeight(5);

  gLines = [];
  gClearX = 0;
  let count = 10;
  let ampMin = 20;
  let amp = count * ampMin;
  let ampInc = amp / count;
  for (let i = 0; i < count; i++) {
    gLines.push(new Line(amp, gPalette[i % gPalette.length]));
    amp -= ampInc;
  }
  gMillisStart = millis();
  gIsLoading = true;
}

class Line {
  constructor(amp, col) {
    this.points = [];
    let xp = 0;
    let count = floor(random(10, 50));
    let inc = width / count;
    for (let i = 0; i < count + 1; i++) {
      this.points.push(new Point(xp, i === 0 || i === count, amp));
      xp += inc;
    }

    this.firstPoint = this.points[0];
    this.lastPoint = this.points[count];
    this.color = col;
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
    this.pos = createVector(0, gMidY);
    this.endX = xp;
    this.amp = amp;
    this.offset = random(0, TWO_PI);
    this.isStatic = isStatic;
  }

  update(t, complete) {
    let curAmp = map(this.easeInOutSine(complete), 0, 1, this.amp, 0);
    this.pos.x = this.endX * complete;
    this.pos.y = gMidY + (this.isStatic ? 0 : curAmp * sin(t + this.offset));
  }

  easeInOutSine(t) {
    return -(cos(PI * t) - 1) / 2;
  }
}
