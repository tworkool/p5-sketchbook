class Firework {
  constructor(position, velocity) {
    this.p = position;
    this.v = velocity;
    this.pSystem = undefined;
    this.history = [];
    this.MAX_HISTORY = 20;
    this.exploded = false;
    this.cPalette = getRandomArrayItem(colorPalettes);
  }

  update() {
    if (this.exploded === false) {
      this.p.add(this.v);
      this.drawRocket();
      this.history.unshift(this.p.copy());
    } else {
      if (this.MAX_HISTORY > 0) {
        this.MAX_HISTORY--;
        noStroke();
        const c = color(getRandomArrayItem(this.cPalette));
        c.setAlpha(50);
        fill(c, 50);
        ellipse(this.p.x, this.p.y, this.MAX_HISTORY * 5);
      }
    }

    this.drawTail();

    this.pSystem?.update();

    this.checkExplosion();

    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }
  }

  isDormant() {
    return this.MAX_HISTORY == 0 && this.pSystem?.isDormant();
  }

  checkExplosion() {
    if (this.exploded === true) return;
    if (this.p.y < random(height * 0.1, height * 0.5)) {
      this.exploded = true;
      this.pSystem = new ParticleSystem(
        random(100, 200),
        random(50, 150),
        this.cPalette,
        25,
        1,
        1,
        createVector(this.p.x, this.p.y)
      );
    }
  }

  drawRocket() {
    noStroke();
    fill(255);
    ellipse(this.p.x, this.p.y, 10);
  }

  drawTail() {
    noFill();
    stroke(255);
    strokeWeight(2);
    beginShape();
    for (const pos of this.history) {
      vertex(pos.x, pos.y);
    }
    endShape();

    /* strokeWeight(5);
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
    } */
  }
}
