// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let gFlocks = [];
let gFlockCount = 20;
let gFlockSize = 20;
let gDesiredSeparation = 25;
let gNeighborDist = 200;
let gBuffer = 10;

let gMainHue;

let gPause = false;

let gPalette = ['#a8d1e7', '#b3dbda', '#BCAFDB', '#B6CCE3', '#ADDBBC']; //, '#58837c', '#83a994', '#a0b6a9'];

let gBgColor = '#fee6e0';

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  noStroke();
  gMainHue = random();

  for (let i = 0; i < gFlockCount; i++) {
    gFlocks.push(new Flock());
  }
  background(gBgColor);
}

function keyTyped() {
  if (key === ' ') gPause = !gPause;
}

function draw() {
  if (gPause) return;
  // fill(1, 0.5); //, 5);
  // noStroke();
  // rect(0, 0, width, height);
  for (let flock of gFlocks) {
    flock.run();
  }
  console.log(frameRate());
}

class Flock {
  constructor() {
    this.col = color(random(), 1, 1, 0.05);
    this.boids = [];

    let props = {
      col: random(gPalette),
      w: random(2, 25),
      l: random(2, 50),
      fMax: random(0.01, 1), //random(0.01, 0.05),
      sMax: random(4, 6), //random(1, 3),
      sep: random(0.5, 2), //random(1.5, 2),
      ali: random(0.5, 2), //random(0.5, 0.7),
      coh: random(0.2, 0.5), //random(0.5, 0.7),
    };

    // this.forceMax = 0.03;
    // this.speedMax = 2;
    // this.scalarS = 1.5;
    // this.scalarA = 1;
    // this.scalarC = 1;

    let flockSize = random(0.5, 1) * gFlockSize;

    for (let i = 0; i < gFlockSize; i++) {
      this.boids.push(new Boid(props));
    }
  }

  run() {
    //fill(this.col);
    for (let b of this.boids) {
      b.run(this.boids);
      b.draw();
    }
  }
}

class Boid {
  constructor(props) {
    this.width = props.w + random(5);
    this.length = props.l;
    let alpha = map(this.width, 2, 20, 0.08, 0.05);
    let c = color(props.col);
    let h = (hue(c) + random(0.08)) % 1.0;
    let s = (saturation(c) + random(0.08)) % 1.0;
    let b = random(0.2, 1); //0.5; //this.clamp(brightness(c) + random(0.08), 0, 1);
    this.col = random() < 0.8 ? color(h, s, b, alpha) : color(1, 0.025);
    this.pos = createVector(random(width), random(height));
    let angle = random(TWO_PI);
    this.vel = createVector(cos(angle), sin(angle));
    this.forceMax = props.fMax;
    this.speedMax = props.sMax;
    this.scalarS = props.sep;
    this.scalarA = props.ali;
    this.scalarC = props.coh;
  }

  run(boids) {
    this.flock(boids);
    this.bounds();
    this.draw();
  }

  flock(boids) {
    let forceS = this.separate(boids);
    let forceA = this.align(boids);
    let forceC = this.cohesion(boids);
    forceS.mult(this.scalarS);
    forceA.mult(this.scalarA);
    forceC.mult(this.scalarC);

    let a = forceS;
    a.add(forceA);
    a.add(forceC);

    this.vel.add(a);
    this.vel.limit(this.speedMax);
    this.pos.add(this.vel);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(this.speedMax);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.forceMax);
    return steer;
  }

  separate(boids) {
    let steer = createVector(0, 0);
    let count = 0;
    for (let boid of boids) {
      let d = p5.Vector.dist(this.pos, boid.pos);
      if (d > 0 && d < gDesiredSeparation) {
        let diff = p5.Vector.sub(this.pos, boid.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.speedMax);
      steer.sub(this.vel);
      steer.limit(this.forceMax);
    }

    return steer;
  }
  align(boids) {
    let sum = createVector(0, 0);
    let steer = createVector(0, 0);
    let count = 0;
    for (let boid of boids) {
      let d = p5.Vector.dist(this.pos, boid.pos);
      if (d > 0 && d < gNeighborDist) {
        sum.add(boid.vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.speedMax);
      steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.forceMax);
    }
    return steer;
  }
  cohesion(boids) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let boid of boids) {
      let d = p5.Vector.dist(this.pos, boid.pos);
      if (d > 0 && d < gNeighborDist) {
        sum.add(boid.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return createVector(0, 0);
  }

  draw() {
    let theta = this.vel.heading() + HALF_PI;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    fill(this.col);
    beginShape(TRIANGLES);
    vertex(0, -this.length);
    vertex(-this.width, this.width);
    vertex(this.width, this.width);
    endShape();

    pop();
  }

  bounds() {
    if (this.pos.x < -gBuffer) this.pos.x = width + gBuffer;
    if (this.pos.y < -gBuffer) this.pos.y = height + gBuffer;
    if (this.pos.x > width + gBuffer) this.pos.x = -gBuffer;
    if (this.pos.y > height + gBuffer) this.pos.y = -gBuffer;
  }

  clamp(value, minRange, maxRange) {
    return min(max(value, minRange), maxRange);
  }
}
