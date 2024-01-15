// Created for the #Genuary2024 - Day 12 - Lava Lamp
// https://genuary.art/prompts#jan12
// Based off Patt Vira's p5.js Coding Tutorial | Lava Lamp (Marching Squares)
// https://www.youtube.com/watch?v=lEiXBA_xHOQ

let gLavaBlobs = [];
let gHue;
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  strokeWeight(0.5);
  gHue = random(0, 360);

  let count = 5;
  for (let i = 0; i < count; i++) {
    gLavaBlobs.push(new Lava(i / (count - 1)));
  }
}

function draw() {
  background(0);

  for (let lava of gLavaBlobs) {
    lava.draw();
  }
}

class Lava {
  constructor(per) {
    this.weight = map(per, 0, 1, 1, 6);
    this.hue = (gHue + 50 * per) % 360;
    this.brightness = map(per, 0, 1, 50, 100);
    this.color = color(this.hue, 100, this.brightness);
    this.cols;
    this.rows;
    this.size = 15;
    this.grid = [];

    this.circles = [];
    let min = map(per, 0, 1, 20, 50);
    let max = map(per, 0, 1, 50, 100);
    this.num = 1000 / min;

    this.cols = width / this.size + 1;
    this.rows = height / this.size + 1;

    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = 0;
      }
    }

    for (let i = 0; i < this.num; i++) {
      this.circles[i] = new Circle(min, max);
    }
  }

  updateColor() {
    this.hue = (this.hue + 0.25) % 360;
    this.color = color(this.hue, 100, this.brightness);
  }

  draw() {
    this.updateColor();
    stroke(this.color);
    strokeWeight(this.weight);
    // Calculate values for each grid cell based on circle positions
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let val = 0;
        for (let k = 0; k < this.num; k++) {
          val +=
            (this.circles[k].r * this.circles[k].r) /
            ((i * this.size - this.circles[k].x) * (i * this.size - this.circles[k].x) +
              (j * this.size - this.circles[k].y) * (j * this.size - this.circles[k].y));
        }
        this.grid[i][j] = val;
      }
    }

    // Move circles and display them
    for (let i = 0; i < this.num; i++) {
      this.circles[i].move();
    }

    // Draw lines connecting points based on grid values
    for (let i = 0; i < this.cols - 1; i++) {
      for (let j = 0; j < this.rows - 1; j++) {
        let [a, b, c, d] = [0, 0, 0, 0];
        let f_a = this.grid[i][j];
        let f_b = this.grid[i + 1][j];
        let f_c = this.grid[i + 1][j + 1];
        let f_d = this.grid[i][j + 1];

        // Convert grid values to binary based on a threshold
        a = f_a >= 1 ? 1 : 0;
        b = f_b >= 1 ? 1 : 0;
        c = f_c >= 1 ? 1 : 0;
        d = f_d >= 1 ? 1 : 0;

        let config = 8 * a + 4 * b + 2 * c + 1 * d;

        // Calculate intermediate points for line drawing
        let pt1 = createVector();
        let amt = (1 - f_a) / (f_b - f_a);
        pt1.x = lerp(i * this.size, i * this.size + this.size, amt);
        pt1.y = j * this.size;

        let pt2 = createVector();
        amt = (1 - f_b) / (f_c - f_b);
        pt2.x = i * this.size + this.size;
        pt2.y = lerp(j * this.size, j * this.size + this.size, amt);

        let pt3 = createVector();
        amt = (1 - f_d) / (f_c - f_d);
        pt3.x = lerp(i * this.size, i * this.size + this.size, amt);
        pt3.y = j * this.size + this.size;

        let pt4 = createVector();
        amt = (1 - f_a) / (f_d - f_a);
        pt4.x = i * this.size;
        pt4.y = lerp(j * this.size, j * this.size + this.size, amt);

        // Draw lines based on binary configuration
        switch (config) {
          case 0:
            break;
          case 1:
            line(pt3.x, pt3.y, pt4.x, pt4.y);
            break;
          case 2:
            line(pt2.x, pt2.y, pt3.x, pt3.y);
            break;
          case 3:
            line(pt2.x, pt2.y, pt4.x, pt4.y);
            break;
          case 4:
            line(pt1.x, pt1.y, pt2.x, pt2.y);
            break;
          case 5:
            line(pt1.x, pt1.y, pt4.x, pt4.y);
            line(pt2.x, pt2.y, pt3.x, pt3.y);
            break;
          case 6:
            line(pt1.x, pt1.y, pt3.x, pt3.y);
            break;
          case 7:
            line(pt1.x, pt1.y, pt4.x, pt4.y);
            break;
          case 8:
            line(pt1.x, pt1.y, pt4.x, pt4.y);
            break;
          case 9:
            line(pt1.x, pt1.y, pt3.x, pt3.y);
            break;
          case 10:
            line(pt1.x, pt1.y, pt2.x, pt2.y);
            line(pt3.x, pt3.y, pt4.x, pt4.y);
            break;
          case 11:
            line(pt1.x, pt1.y, pt2.x, pt2.y);
            break;
          case 12:
            line(pt2.x, pt2.y, pt4.x, pt4.y);
            break;
          case 13:
            line(pt2.x, pt2.y, pt3.x, pt3.y);
            break;
          case 14:
            line(pt3.x, pt3.y, pt4.x, pt4.y);
            break;
          case 15:
            break;
        }
      }
    }
  }
}

class Circle {
  constructor(min, max) {
    this.x = random(0, width);
    this.y = random(0, height);
    this.r = random(min, max);
    this.dx = random(-2, 2);
    this.dy = random(-2, 2);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x >= width || this.x < 0) {
      this.dx *= -1;
    }
    if (this.y >= height || this.y < 0) {
      this.dy *= -1;
    }
  }

  display() {
    noFill();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
