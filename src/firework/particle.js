class Particle {
  constructor(position, lifeTime, velocity, color, size, fadeOut = true) {
    this.v = velocity;
    this.p = position;
    this.lifeTime = lifeTime;
    this.createTime = time;
    this.size = size;
    this.c = color;
    this.fadeOut = fadeOut;
    this.angle = random(1);
    this.history = [];
    this.MAX_HISTORY = 8;
  }

  update() {
    this.p.add(this.calculatePath(this.angle));
    this.drawTail();
    if (!this.isOffScreen()) {
      this.draw();
    }

    this.history.unshift(this.p.copy());

    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }
  }

  isOffScreen() {
    return (
      this.p.x < 0 || this.p.x > width || this.p.y < 0 || this.p.y > height
    );
  }

  draw() {
    noStroke();
    if (this.fadeOut) {
      const fadedColorAlpha = map(
        time,
        this.createTime,
        this.createTime + this.lifeTime * timeStep,
        250,
        100
      );
      const fadedSize =
        map(
          time,
          this.createTime,
          this.createTime + this.lifeTime * timeStep,
          this.size,
          this.size * 0.33
        ) % this.size;
      fill(color(this.c), fadedColorAlpha);
      ellipse(this.p.x, this.p.y, fadedSize);
    } else {
      fill(color(this.c), 250);
      rect(this.p.x, this.p.y, this.size);
    }
  }

  calculatePath(angle) {
    const relativeTime = time - this.createTime;
    let x = -this.v.x * cos(angle) * relativeTime;
    let y = 0.5 * g * relativeTime ** 2 + -this.v.y * sin(angle) * relativeTime;
    return createVector(x, y);
  }

  drawTail() {
    strokeWeight(1);
    noFill();
    for (let i = 0; i < this.history.length; i++) {
      if (i == 0) {
        continue;
      }
      const cPos = this.history[i];
      if (!cPos) {
        continue;
      }
      const pPos = this.history[i - 1];
      stroke(255, map(i + 1, this.MAX_HISTORY, 0, 0, 200));
      line(cPos.x, cPos.y, pPos.x, pPos.y);
    }
  }
}
