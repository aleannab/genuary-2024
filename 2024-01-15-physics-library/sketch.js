// #Genuary2024 - Day 15 - Use a physics library
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
let gLineCount = 30;
let gLineWidth;
let gNextUpdate;

let gGravityDir;

let gPalette = ['#60458a', '#f3e68e', '#27cae9', '#e0e2e2'];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  noStroke();

  gEngine = Engine.create();
  gWorld = gEngine.world;
  gWorld.gravity.y = 0.2;

  let params = {
    isStatic: true,
  };
  const halfW = width / 2;
  const halfH = height / 2;
  let ground = Bodies.rectangle(halfW, height + 50, width + 100, 100, params);
  let wall1 = Bodies.rectangle(-50, halfH, 100, height, params);
  let wall2 = Bodies.rectangle(width + 50, halfH, 100, height, params);
  let top = Bodies.rectangle(halfW, -50, width, 100, params);
  World.add(gWorld, [ground, wall1, wall2, top]);

  let yInc = height / (gLineCount + 2);
  for (let i = 0; i < gLineCount; i++) {
    addBlock(random(width / 2), i * yInc, i);
  }
  Matter.Runner.run(gEngine);

  gNextUpdate = millis();
}

function addBlock(x, y, id) {
  let particleOptions = {
    friction: 0.05,
    frictionStatic: 0.2,
    density: 0.1,
    render: { visible: true },
  };
  let columns = int(random(10, 20));
  let rows = 2;
  let softBody = createSoftBody(x, y, columns, rows, 0, 0, true, 10, particleOptions);
  softBody.color = gPalette[id % gPalette.length];
  softBody.size = { w: columns, h: rows };
  softBody.activeTs = frameCount;

  gAllLines.push(softBody);
  World.add(gWorld, [softBody]);
}

function createSoftBody(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
  let Common = Matter.Common,
    Composites = Matter.Composites,
    Bodies = Matter.Bodies;

  particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
  constraintOptions = Common.extend({ stiffness: 0.2, render: { type: 'line', anchors: false } }, constraintOptions);

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
    gWorld.gravity.x = random(-0.2, 0.2);
    gWorld.gravity.y = random(-0.2, 0.2);
    gNextUpdate = cur + 2000;
  }

  background(0);
  for (let block of gAllLines) {
    fill(block.color);
    beginShape();
    let drawVertex = (i, o) => {
      let b = block.bodies[o * block.size.w + i];
      vertex(b.position.x, b.position.y);
    };

    // top
    for (let i = 0; i < block.size.w; i++) {
      drawVertex(i, 0);
    }
    // right
    for (let i = 0; i < block.size.h; i++) {
      drawVertex(block.size.w - 1, i);
    }
    // bottom
    for (let i = block.size.w - 1; i >= 0; i--) {
      drawVertex(i, block.size.h - 1);
    }
    // left
    for (let i = block.size.h - 1; i >= 0; i--) {
      drawVertex(0, i);
    }
    endShape(CLOSE);
  }
}
