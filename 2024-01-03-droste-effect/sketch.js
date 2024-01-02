// Created for #Genuary2024 - Droste Effect

let gScaleVar = 0.9;

function setup() {
  let length = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(length, length, WEBGL);
  //noLoop();
  noStroke();
}

function draw() {
  background(255);
  drawDroste(0, 0, height, 0, 50); // Adjust the number of iterations
}

function drawDroste(x, y, size, angle, level) {
  if (level > 0 && size > 1) {
    let half = size * 0.5;
    let quarter = size * 0.25;
    let t = millis() * 0.001;
    push();
    rotateZ(angle);
    let adjX = x - half;
    let adjY = y - half;
    fill(0);
    rect(adjX, adjY, size, size);

    fill(255);
    let small = 0.9 * size;
    let offset = 0.1 * half;
    rect(adjX + offset, adjY + offset, small, small);

    fill(0);
    rect(x + quarter, y + quarter, quarter, quarter);
    rect(x - half, y - half, quarter, quarter);

    let new_size = size * gScaleVar;
    let new_angle = angle + 0.0001 * width * t;
    pop();
    drawDroste(x, y, new_size, new_angle, level - 1);
  }
}

function mouseClicked() {}
