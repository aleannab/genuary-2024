// Created for the #Genuary2024 - Day 12 - Lava Lamp
// https://genuary.art/prompts#jan12
// Based off Patt Vira's p5.js Coding Tutorial | Lava Lamp (Marching Squares)
// https://www.youtube.com/watch?v=lEiXBA_xHOQ

let val;

let cols;
let rows;
let size = 10;
let grid = [];

let circles = [];
let num = 50; // Number of circles

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = width / size + 1;
  rows = height / size + 1;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }

  for (let i = 0; i < num; i++) {
    circles[i] = new Circle();
  }
  strokeWeight(0.5);
}

function draw() {
  background(220);

  // Calculate values for each grid cell based on circle positions
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let val = 0;
      for (let k = 0; k < num; k++) {
        val +=
          (circles[k].r * circles[k].r) /
          ((i * size - circles[k].x) * (i * size - circles[k].x) + (j * size - circles[k].y) * (j * size - circles[k].y));
      }
      grid[i][j] = val;

      fill(255);
    }
  }

  // Move circles and display them
  for (let i = 0; i < num; i++) {
    circles[i].move();
  }

  // Draw lines connecting points based on grid values
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let [a, b, c, d] = [0, 0, 0, 0];
      let f_a = grid[i][j];
      let f_b = grid[i + 1][j];
      let f_c = grid[i + 1][j + 1];
      let f_d = grid[i][j + 1];

      // Convert grid values to binary based on a threshold
      a = f_a >= 1 ? 1 : 0;
      b = f_b >= 1 ? 1 : 0;
      c = f_c >= 1 ? 1 : 0;
      d = f_d >= 1 ? 1 : 0;

      let config = 8 * a + 4 * b + 2 * c + 1 * d;

      // Calculate intermediate points for line drawing
      let pt1 = createVector();
      let amt = (1 - f_a) / (f_b - f_a);
      pt1.x = lerp(i * size, i * size + size, amt);
      pt1.y = j * size;

      let pt2 = createVector();
      amt = (1 - f_b) / (f_c - f_b);
      pt2.x = i * size + size;
      pt2.y = lerp(j * size, j * size + size, amt);

      let pt3 = createVector();
      amt = (1 - f_d) / (f_c - f_d);
      pt3.x = lerp(i * size, i * size + size, amt);
      pt3.y = j * size + size;

      let pt4 = createVector();
      amt = (1 - f_a) / (f_d - f_a);
      pt4.x = i * size;
      pt4.y = lerp(j * size, j * size + size, amt);

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

class Circle {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.r = random(20, 50);
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
