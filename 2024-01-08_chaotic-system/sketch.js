// Created for the #Genuary2024 - Day 8 - Chaotic System
// https://genuary.art/prompts#jan8

let g = 1;

let gDoublePendulumns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = 200;

  gDoublePendulumns.push(new DoublePendulum());
  background(255);
}

function draw() {
  //background(255);

  for (let pen of gDoublePendulumns) {
    pen.update();
  }
}

class DoublePendulum {
  constructor() {
    this.p0 = new Pendulum();
    this.p1 = new Pendulum();
  }

  update() {
    let num1 = -g * (2 * this.p0.mass + this.p1.mass) * sin(this.p0.angle);
    let num2 = -this.p1.mass * g * sin(this.p0.angle - 2 * this.p1.angle);
    let num3 = -2 * sin(this.p0.angle - this.p1.angle) * this.p1.mass;
    let num4 = this.p1.avel * this.p1.avel * this.p1.length + this.p0.avel * this.p0.avel * this.p0.length * cos(this.p0.angle - this.p1.angle);
    let den = this.p0.length * (2 * this.p0.mass + this.p1.mass - this.p1.mass * cos(2 * this.p0.angle - 2 * this.p1.angle));
    this.p0.acc = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(this.p0.angle - this.p1.angle);
    num2 = this.p0.avel * this.p0.avel * this.p0.length * (this.p0.mass + this.p1.mass);
    num3 = g * (this.p0.mass + this.p1.mass) * cos(this.p0.angle);
    num4 = this.p1.avel * this.p1.avel * this.p1.length * this.p1.mass * cos(this.p0.angle - this.p1.angle);
    den = this.p1.length * (2 * this.p0.mass + this.p1.mass - this.p1.mass * cos(2 * this.p0.angle - 2 * this.p1.angle));
    this.p1.acc = (num1 * (num2 + num3 + num4)) / den;

    push();
    translate(width / 2, 200);
    this.p0.update();
    this.p1.update(this.p0.pos);
    pop();
  }
}

class Pendulum {
  constructor() {
    this.length = random(0.1, 0.5) * height;
    this.mass = random(20, 40);
    this.angle = HALF_PI;
    this.avel = 0;
    this.acc = 0;
    this.pos = createVector(this.length * sin(this.angle), this.length * cos(this.angle));
    this.prevPos = createVector(this.pos.x, this.pos.y);
  }

  update(offset = createVector(0, 0)) {
    let dt = 0.5; //0.01;
    this.pos.x = offset.x + this.length * sin(this.angle);
    this.pos.y = offset.y + this.length * cos(this.angle);

    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;

    this.draw();

    this.avel += this.acc * dt;
    this.angle += this.avel * dt;
  }

  draw() {
    fill(0);
    ellipse(this.pos.x, this.pos.y, 2, 2); //this.mass, this.mass);
  }
}
