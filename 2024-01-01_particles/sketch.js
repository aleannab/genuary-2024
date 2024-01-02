// Created for #Genuary2024 - Particles

let gLastTime = 0;

let gGravitySwitchTime = 0;
let gHue;

let gSystems = [];
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);

  gHue = 180; //random(0, 360);
  for (let i = 0; i < 7; i++) {
    let system = new ParticleSystem(createVector(0, 0, 0), (gHue + 25 * i) % 360);
    system.addParticle();
    gSystems.push(system);
  }

  gGravity = createVector(1, 1, 0);
}

function mouseClicked() {}

function draw() {
  background(0);
  const curTime = millis();
  let dt = (curTime - gLastTime) * 0.1;
  gLastTime = curTime;

  if (curTime > gGravitySwitchTime) {
    gGravitySwitchTime = curTime + random(50, 1000);
    gGravity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    for (let system of gSystems) {
      system.updateGravity();
    }
    //console.log(getFrameRate());
  }

  ambientLight(255);

  for (let system of gSystems) {
    system.addParticle();

    system.run(dt);
  }
}

class Particle {
  constructor(position, directionY, mass, gravity) {
    this.velocity = createVector(random(-1, 1), directionY, random(-1, 1)).mult(0.2);

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

    sphere(map(this.lifespan, 0, 1, 0, 8));
    pop();
  }

  isDead() {
    return this.lifespan < 0;
  }
}

class ParticleSystem {
  constructor(position, hue) {
    this.origin = position.copy();
    this.particles = [];
    this.hue = hue;
    this.mass = random(25, 50); //random(0, 100);
    this.directionY = random(-1, 1); // * 0.25;
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
    rotateY(0.0005 * millis());
    ambientMaterial(this.hue, 100, 100);
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
