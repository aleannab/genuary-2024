// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let gFlock;
let gFlockSize = 300;
let gDesiredSeparation = 25;
let gNeighborDist = 50;
let gBuffer = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gFlock = new Flock();
  background(255);
}

function mouseClicked() {}

function draw() {
  fill(255, 5);
  noStroke();
  rect(0, 0, width, height);
  gFlock.run();
  console.log(frameRate());
}

class Flock {
  constructor() {
    this.boids = [];
    for (let i = 0; i < gFlockSize; i++) {
      this.boids.push(new Boid());
    }
  }

  run() {
    for (let b of this.boids) {
      b.run(this.boids);
      b.draw();
    }
  }
}

class Boid {
  constructor() {
    this.pos = createVector(random(width), random(height));
    let angle = random(TWO_PI);
    this.v = createVector(cos(angle), sin(angle));
    this.r = 2; //random() * 30;
    this.forceMax = 0.03;
    this.speedMax = 2;
    this.scalarS = 1.5;
    this.scalarA = 1;
    this.scalarC = 1;
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

    this.v.add(a);
    this.v.limit(this.speedMax);
    this.pos.add(this.v);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(this.speedMax);

    let steer = p5.Vector.sub(desired, this.v);
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
      steer.sub(this.v);
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
        sum.add(boid.v);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.speedMax);
      steer = p5.Vector.sub(sum, this.v);
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
    let theta = this.v.heading() + radians(HALF_PI);
    fill(0);
    stroke(0);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -this.r);
    vertex(-this.r, this.r);
    vertex(this.r, this.r);
    endShape();
    pop();
  }

  bounds() {
    if (this.pos.x < -gBuffer) this.pos.x = width + gBuffer;
    if (this.pos.y < -gBuffer) this.pos.y = height + gBuffer;
    if (this.pos.x > width + gBuffer) this.pos.x = -gBuffer;
    if (this.pos.y > height + gBuffer) this.pos.y = -gBuffer;
  }
}
