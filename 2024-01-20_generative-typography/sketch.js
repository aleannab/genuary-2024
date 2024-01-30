// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let font;
let word = 'GENUARY2024';
let gTextSize = 200;
let gSpacingX = 100;
let gSpacingY = gTextSize / 4;
let gCharacters = [];
let gBuffer = 100;

function preload() {
  font = loadFont('RobotoMono-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  stroke(255);
  noFill();
  strokeWeight(0.5);

  let bounds = font.textBounds(word, 0, 0, gTextSize);

  if (bounds.w < width) {
    let horizSpace = (width - bounds.w) / 2;
    gBuffer = horizSpace;
  } else {
    let charBounds = font.textBounds(word.charAt(0), 0, 0, gTextSize);
    gBuffer = charBounds.w / 2;
  }

  let initX = gBuffer;
  let initY = bounds.h;
  let xp = initX;
  let yp = initY;
  let numRows = 1;
  for (let i = 0; i < word.length; i++) {
    let letter = word.charAt(i);
    let cWidth = font.textBounds(letter, 0, 0, gTextSize).w + gSpacingX;

    if (xp + cWidth > width - gBuffer) {
      xp = initX;
      yp += bounds.h + gSpacingY;
      numRows++;
    }
    gCharacters.push(new Character(letter, xp, yp));
    xp += gSpacingX; //cWidth + gSpacingX;
  }

  let vertSpace = (height - numRows * (bounds.h + gSpacingY) - gSpacingY) / 2;
  for (let c of gCharacters) {
    c.yp += vertSpace + 50;
    c.xp += 130;
  }
}

function draw() {
  background(0);

  let t = millis() / 2000;
  for (let i = 0; i < 10; i++) {
    let sample = abs(0.1 * sin(t));
    let threshold = gTextSize * (0.05 + 0.01 * i);

    for (let c of gCharacters) {
      c.update(sample, threshold);
      c.draw();
    }
  }
}

class Character {
  constructor(c, xp, yp) {
    this.c = c;
    this.xp = xp;
    this.yp = yp;
    this.rows = [];
  }

  update(sample, threshold) {
    let points = font.textToPoints(this.c, this.xp, this.yp, gTextSize, {
      sampleFactor: sample,
      simplifyThreshold: 0,
    });

    points.sort((a, b) => a.y - b.y);

    let groups = {};

    for (let pt of points) {
      let roundedY = floor(pt.y / threshold);
      groups[roundedY] = groups[roundedY] || [];
      groups[roundedY].push(pt);
    }

    this.rows = Object.values(groups);

    for (let row of this.rows) {
      row.sort((a, b) => a.x - b.x);
    }
  }

  draw() {
    for (let row of this.rows) {
      beginShape();
      for (let i = 0; i < row.length; i++) {
        if (i % 2 === 0) {
          beginShape();
          vertex(row[i].x, row[i].y);
        } else {
          vertex(row[i].x, row[i].y);
          endShape();
        }
        //circle(row[i].x, row[i].y, 2);
      }
      endShape();
    }
  }
}
