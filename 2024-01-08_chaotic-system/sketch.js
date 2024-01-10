// Created for the #Genuary2024 - Day 8 - Chaotic System
// https://genuary.art/prompts#jan8
//
// Utilizes double pendulum motion to generate paths

let g = -5;

let gDoublePendulumns = [];
let gMainHue;
let gStart = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  noStroke();
  // noFill();
  // strokeWeight(5);
  cx = width / 2;
  cy = 200;
  gMainHue = random(180, 250);

  let count = 100;
  for (let i = 0; i < count; i++) {
    gDoublePendulumns.push(new DoublePendulum());
  }
  background(0);
}

function mouseClicked() {
  gStart = !gStart;
}

function draw() {
  if (!gStart) return;

  for (let pen of gDoublePendulumns) {
    pen.update();
  }
}

class DoublePendulum {
  constructor() {
    this.p0 = new Pendulum();
    this.p1 = new Pendulum();
    this.color = random(0, 1) < 0.3 ? color(0, 0, 0, 0.01) : color(floor(gMainHue + random(0, 100)) % 360, 100, 100, 0.03);
    this.x = random(0, width);
    this.y = random(0, height);
    this.g = random(-5, 5);
  }

  update() {
    let num1 = -this.g * (2 * this.p0.mass + this.p1.mass) * sin(this.p0.angle);
    let num2 = -this.p1.mass * this.g * sin(this.p0.angle - 2 * this.p1.angle);
    let num3 = -2 * sin(this.p0.angle - this.p1.angle) * this.p1.mass;
    let num4 = this.p1.avel * this.p1.avel * this.p1.length + this.p0.avel * this.p0.avel * this.p0.length * cos(this.p0.angle - this.p1.angle);
    let den = this.p0.length * (2 * this.p0.mass + this.p1.mass - this.p1.mass * cos(2 * this.p0.angle - 2 * this.p1.angle));
    this.p0.acc = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(this.p0.angle - this.p1.angle);
    num2 = this.p0.avel * this.p0.avel * this.p0.length * (this.p0.mass + this.p1.mass);
    num3 = this.g * (this.p0.mass + this.p1.mass) * cos(this.p0.angle);
    num4 = this.p1.avel * this.p1.avel * this.p1.length * this.p1.mass * cos(this.p0.angle - this.p1.angle);
    den = this.p1.length * (2 * this.p0.mass + this.p1.mass - this.p1.mass * cos(2 * this.p0.angle - 2 * this.p1.angle));
    this.p1.acc = (num1 * (num2 + num3 + num4)) / den;

    push();
    translate(this.x, this.y);
    fill(this.color);

    this.p0.update();
    this.p1.update(true, this.p0.pos);
    pop();
  }
}

class Pendulum {
  constructor() {
    this.length = random(0.05, 0.4) * width;
    this.mass = random(5, 30);
    this.angle = HALF_PI;
    this.avel = 0;
    this.acc = 0;
    this.pos = createVector(this.length * sin(this.angle), this.length * cos(this.angle));
    this.prevPos = createVector(this.pos.x, this.pos.y);
    this.rad = random(20, 100);
  }

  update(draw = false, offset = createVector(0, 0)) {
    let dt = 0.1; //0.05; //0.01;
    this.pos.x = offset.x + this.length * sin(this.angle);
    this.pos.y = offset.y + this.length * cos(this.angle);

    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;

    if (draw) this.draw();

    this.avel += this.acc * dt;
    this.angle += this.avel * dt;
  }

  draw() {
    ellipse(this.pos.x, this.pos.y, this.mass, this.mass); //this.mass, this.mass);
  }
}
