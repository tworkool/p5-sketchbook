const planetList = [];
let planetIdIterator = 0;
const G = 0.1;
const OFF_SCREEN_MARGIN = 20;
const MAX_INIT_VELOCITY = 2;
const MAX_VELOCITY = 100;
const MAX_PLANETS = 20;
const TIME_STEP = 0.5;

function setup() {
  //createCanvas(900, 700);
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  ellipseMode(CENTER);
}

function createPlanetOffScreen() {
  let newPlanetPos, newPlanetVelocity;

  const quadrant = random(1);
  if (quadrant > 0 && quadrant <= 0.25) {
    newPlanetPos = createVector(random(width), random(-OFF_SCREEN_MARGIN, 0));
    newPlanetVelocity = createVector(
      random(-MAX_INIT_VELOCITY, MAX_INIT_VELOCITY),
      random(0, MAX_INIT_VELOCITY)
    );
  } else if (quadrant > 0.25 && quadrant <= 0.5) {
    newPlanetPos = createVector(
      random(width, width + OFF_SCREEN_MARGIN),
      random(height)
    );
    newPlanetVelocity = createVector(
      random(-MAX_INIT_VELOCITY, 0),
      random(-MAX_INIT_VELOCITY, MAX_INIT_VELOCITY)
    );
  } else if (quadrant > 0.5 && quadrant < 0.75) {
    newPlanetPos = createVector(
      random(width),
      random(height, height + OFF_SCREEN_MARGIN)
    );
    newPlanetVelocity = createVector(
      random(-MAX_INIT_VELOCITY, MAX_INIT_VELOCITY),
      random(-MAX_INIT_VELOCITY, 0)
    );
  } else {
    newPlanetPos = createVector(random(-OFF_SCREEN_MARGIN, 0), random(height));
    newPlanetVelocity = createVector(
      random(0, MAX_INIT_VELOCITY),
      random(-MAX_INIT_VELOCITY, MAX_INIT_VELOCITY)
    );
  }

  return new Planet(
    newPlanetPos,
    newPlanetVelocity,
    random(10, 30),
    color(230, 20, 20)
  );
}

function draw() {
  background(30);
  showFrameRate();

  if (planetList.length < MAX_PLANETS) {
    planetList.push(createPlanetOffScreen());
    console.log("added new planet");
  }

  for (let i = 0; i < planetList.length; i++) {
    const p = planetList[i];
    p.update();
    p.draw();

    if (p.offScreen()) {
      planetList.splice(i, 1);
    }
  }
}

class Planet {
  constructor(initialPos, initialVel, mass, color) {
    this.pos = initialPos;
    this.vel = initialVel;
    this.m = mass;
    this.r = mass * 3;
    this.c = color;
    this.id = planetIdIterator;
    planetIdIterator++;
    this.history = [];
    this.MAX_HISTORY = 100;
  }

  offScreen() {
    const customOffScreenMargin = OFF_SCREEN_MARGIN * 100;
    return (
      this.pos.x > width + customOffScreenMargin ||
      this.pos.x < -customOffScreenMargin ||
      this.pos.y > height + customOffScreenMargin ||
      this.pos.y < -customOffScreenMargin
    );
  }

  getGravitationForce(p) {
    const diff = p.pos.copy().sub(this.pos);
    const sqrDist = diff.magSq(); // - abs(p.r + this.r);
    const forceDir = diff.copy().normalize();
    const force = (G * this.m * p.m) / sqrDist;
    return createVector(force * forceDir.x, force * forceDir.y);
  }

  setVelocity(p) {
    const gravitationForce = this.getGravitationForce(p);
    this.vel.add(
      createVector(
        gravitationForce.x * TIME_STEP,
        gravitationForce.y * TIME_STEP
      )
    );
  }

  createMovement() {
    for (const p of planetList) {
      if (this.id == p.id) continue;
      this.setVelocity(p);
    }
  }

  update() {
    //this.drawFront();
    this.createMovement();
    // cap max velocity
    //this.vel.normalize().mult(5);
    if (abs(this.vel.x) > MAX_VELOCITY)
      this.vel.x = this.vel.x > 0 ? MAX_VELOCITY : -MAX_VELOCITY;
    if (abs(this.vel.y) > MAX_VELOCITY)
      this.vel.y = this.vel.y > 0 ? MAX_VELOCITY : -MAX_VELOCITY;
    this.pos.add(createVector(this.vel.x * TIME_STEP, this.vel.y * TIME_STEP));

    this.history.unshift(this.pos.copy());
    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }
  }

  drawFront() {
    stroke(255, 200);
    strokeWeight(1);
    const normVelVec = this.vel.copy().normalize().mult(50);
    const directedPos = this.pos.copy().add(normVelVec);
    line(this.pos.x, this.pos.y, directedPos.x, directedPos.y);
  }

  draw() {
    noStroke();
    fill(255, 255, 225);
    ellipse(this.pos.x, this.pos.y, this.r);
    this.drawTrail();
  }

  drawTrail() {
    /* noFill();
    stroke(255);
    strokeWeight(2);
    beginShape();
    for (const pos of this.history) {
      vertex(pos.x, pos.y);
    }
    endShape(); */
    strokeWeight(this.r);
    noFill();
    for (let i = 0; i < this.history.length; i++) {
      if (i == 0) {
        continue;
      }
      stroke(255, map(i + 1, this.MAX_HISTORY, 0, 0, 200));
      //stroke(255);
      const cPos = this.history[i],
        pPos = this.history[i - 1];
      line(cPos.x, cPos.y, pPos.x, pPos.y);
    }
  }
}
