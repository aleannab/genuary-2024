// Created for #Genuary2024 - Day 3 - Droste Effect
// https://genuary.art/prompts#jan3

let gScaleVar = 0.9;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  background(0);
}

function draw() {
  drawDroste(0, 0, width, 0, 50);
}

function drawDroste(x, y, size, angle, level) {
  if (level > 0 && size > 1) {
    let half = size * 0.5;
    let quarter = size * 0.25;
    let adjX = x - half;
    let adjY = y - half;

    let t = millis() * 0.001;

    push();
    rotateZ(angle);

    fill(0);
    rect(adjX, adjY, size, size);

    fill(255);
    let small = 0.91 * size;
    let offset = 0.09 * half;
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
