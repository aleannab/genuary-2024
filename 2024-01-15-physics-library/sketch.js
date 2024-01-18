// #Genuary2024 - Combining Day 15 and Day 21 since I'm already behind
// Use a physics library and Use a library that you haven’t used before.
// https://genuary.art/prompts#jan15

let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Example = Matter.Example,
  Common = Matter.Common;

let gEngine;
let gLines = [];
let gAllLines = [];
let gSpacing = 20;

let gUnitSize = 8;
let gUnitMin = 5;
let gUnitMax = 40;
let gNextUpdate;

let gGravityDir;
let gGravityScale = 0.9;

let gBgColor = '#000000';
let gPalette = ['#636363', '#3b3b3b', '#222222', '#141414', '#000000'];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
  colorMode(RGB, 1);

  gEngine = Engine.create();
  gWorld = gEngine.world;
  gWorld.gravity.y = gGravityScale;

  let params = {
    isStatic: true,
  };
  const halfW = width / 2;
  const halfH = height / 2;
  let ground = Bodies.rectangle(halfW - 50, height + 50, width + 100, 100, params);
  let wall1 = Bodies.rectangle(-50, halfH - 50, 100, height + 100, params);
  let wall2 = Bodies.rectangle(width + 50, halfH, 100, height, params);
  let top = Bodies.rectangle(halfW, -50, width, 100, params);
  World.add(gWorld, [ground, wall1, wall2, top]);

  const colBuffer = 1.3 * gUnitMax * gUnitSize + gSpacing;
  const colCount = int(width / colBuffer);

  const rowBuffer = 1.3 * gUnitSize + gSpacing;
  const rowCount = int(height / rowBuffer);

  const yInc = height / rowCount;
  const xInc = width / colCount;

  for (let i = 0; i < colCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      addBlock(i * xInc, j * yInc, i);
    }
  }
  Matter.Runner.run(gEngine);

  gNextUpdate = millis();
}

function addBlock(x, y, id) {
  let particleOptions = {
    friction: 0.05,
    frictionStatic: 0.2,
    density: 0.1,
    render: { visible: false },
    mass: 100,
  };
  let columns = int(random(gUnitMin, gUnitMax));
  let rows = 1;
  let softBody = createSoftBody(x, y, columns, rows, 0, 0, true, gUnitSize, particleOptions);
  softBody.color = color(random(0.5, 1)); //0.8));
  softBody.size = { w: columns, h: rows };
  softBody.activeTs = frameCount;

  gAllLines.push(softBody);
  World.add(gWorld, [softBody]);
}

function createSoftBody(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
  let Common = Matter.Common,
    Composites = Matter.Composites,
    Bodies = Matter.Bodies;

  // inertia: Infinity;
  particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
  constraintOptions = Common.extend({ stiffness: 0.2, render: { type: 'line', anchors: false, lineWidth: 0 } }, constraintOptions);

  let softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
    return Bodies.circle(x, y, particleRadius, particleOptions);
  });

  Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

  softBody.label = 'Soft Body';

  return softBody;
}

function draw() {
  let cur = millis();
  if (cur > gNextUpdate) {
    gWorld.gravity.x = random(-1, 1) * gGravityScale; //0.4, 0.4);
    gWorld.gravity.y = random(-1, 1) * gGravityScale; //0.4, 0.4);
    gNextUpdate = cur + random(500, 2000);
  }

  background(gBgColor);
  for (let block of gAllLines) {
    stroke(block.color);
    beginShape();
    let drawVertex = (i, o) => {
      let b = block.bodies[o * block.size.w + i];
      curveVertex(b.position.x, b.position.y);
    };

    for (let i = 0; i < block.size.w; i++) {
      drawVertex(i, 0);
    }
    for (let i = 0; i < block.size.h; i++) {
      drawVertex(block.size.w - 1, i);
    }
    endShape();
  }
}
