// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan
let font;
let points = [];
let r = 15;
let angle = 0;

function preload() {
  font = loadFont('Roboto-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Calculate the width and height of the text
  let textWidth = font.textBounds('GENUARY', 0, 0, 300).w;
  let textHeight = font.textBounds('GENUARY', 0, 0, 300).h;

  // Calculate the starting position to center the text both horizontally and vertically
  let startX = (width - textWidth) / 2;
  let startY = (height + textHeight) / 2;

  // Generate points for the centered text
  points = font.textToPoints('GENUARY', startX, startY, 300, {
    sampleFactor: 0.1,
    simplifyThreshold: 0,
  });

  angleMode(DEGREES);
}

function draw() {
  background(220);
  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, 10, 10);
  }
  angle += 10;
}
