// Created for the #Genuary2024 -
// https://genuary.art/prompts#jan

let font;
let word = 'GENUARY 2024';
let textSize = 200;
let gThreshold = 1;
let gStartX, gStartY;

function preload() {
  font = loadFont('Roboto-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  stroke(255);
  noFill();
  strokeWeight(0.5);

  // Calculate text bounds once in setup
  let textBounds = font.textBounds(word, 0, 0, textSize);
  gStartX = 0; //textBounds.w; //(width - textBounds.w) / 2;
  gStartY = textBounds.h; // (height + textBounds.h) / 2;
}

function draw() {
  background(0);

  let t = millis() / 2000;
  for (let i = 0; i < 10; i++) {
    let sample = abs(0.1 * sin(t));
    gThreshold = textSize * (0.05 + 0.01 * i);

    let xp = gStartX;
    let yp = gStartY;
    for (let i = 0; i < word.length; i++) {
      let letter = word.charAt(i);
      let points = font.textToPoints(letter, xp, yp, textSize, {
        sampleFactor: sample,
        simplifyThreshold: 0,
      });

      points.sort((a, b) => a.y - b.y);

      let groupedArrays = {};

      points.forEach((point) => {
        let roundedY = floor(point.y / gThreshold);
        groupedArrays[roundedY] = groupedArrays[roundedY] || [];
        groupedArrays[roundedY].push(point);
      });

      let separatedArrays = Object.values(groupedArrays);

      separatedArrays.forEach((groupArray) => {
        groupArray.sort((a, b) => a.x - b.x);
        beginShape();
        for (let i = 0; i < groupArray.length; i++) {
          if (i % 2 === 0) {
            beginShape();
            vertex(groupArray[i].x, groupArray[i].y);
          } else {
            vertex(groupArray[i].x, groupArray[i].y);
            endShape();
          }
          circle(groupArray[i].x, groupArray[i].y, 2);
        }
        endShape();
      });

      xp += font.textBounds(letter, 0, 0, textSize).w + 10;
      if (xp > width) {
        xp = gStartX;
        yp += gStartY;
      }
    }
  }
}
