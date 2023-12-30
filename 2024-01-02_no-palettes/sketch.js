// Created for the #WCCChallenge

let gLastTime = 0;

let gGravitySwitchTime = 0;

let gSystems = [];
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  for (let i = 0; i < 3; i++) {
    let system = new ParticleSystem(createVector(0, 0, 0));
    system.addParticle();
    gSystems.push(system);
  }

  gGravity = createVector(1, 1, 0);
}

function mouseClicked() {}

function draw() {
  //background(51);
  const curTime = millis();
  let dt = (curTime - gLastTime) * 0.1;
  gLastTime = curTime;

  if (curTime - gGravitySwitchTime > 1000) {
    gGravitySwitchTime = curTime;
    gGravity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    for (let system of gSystems) {
      system.updateGravity();
    }
  }

  ambientLight(255);

  for (let system of gSystems) {
    system.addParticle();

    system.run(dt);
  }
}

class Particle {
  constructor(position, directionY, mass, gravity) {
    this.velocity = createVector(random(-1, 1), directionY, random(-1, 1)).mult(0.4);

    this.position = position.copy();
    this.lifespan = 1;
    this.mass = mass;
    this.gravity = gravity;
  }

  update(dt) {
    let netForce = p5.Vector.div(this.gravity, this.mass);
    let acceleration = p5.Vector.mult(netForce, dt);
    this.velocity.add(acceleration);
    let dPos = p5.Vector.mult(this.velocity, dt).add(p5.Vector.mult(acceleration, 0.5 * dt * dt));
    this.position.add(dPos);
    this.lifespan -= 0.001;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y, this.position.z);

    sphere(5);
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
    this.hue = random(0, 360);
    this.mass = random(0, 100);
    this.directionY = random(-1, 1) * 0.25;
    this.gravity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.directionY, this.mass, this.gravity));
  }

  run(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update(dt);
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }

    push();
    rotateY(0.001 * millis());
    ambientMaterial(this.hue, 100, 100, this.lifespan);
    noStroke();
    for (let p of this.particles) {
      p.draw();
    }
    pop();
  }

  updateGravity() {
    this.gravity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    for (let p of this.particles) {
      p.gravity = this.gravity;
    }
  }
}
