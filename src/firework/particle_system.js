class ParticleSystem {
  constructor(
    lifeTime,
    num,
    colorPalette,
    size,
    sizeVarianceFactor = 0.5,
    lifeTimeVarianceFactor = 0.5,
    position = -1
  ) {
    this.lifeTime = lifeTime;
    this.lifeTimeVariance =
      lifeTimeVarianceFactor >= 1
        ? lifeTime
        : lifeTime * lifeTimeVarianceFactor;
    this.n = num;
    this.position = position;
    this.colorPalette = colorPalette;
    this.size = size;
    this.sizeVariance =
      sizeVarianceFactor >= 1 ? size : size * sizeVarianceFactor;

    const _particleList = [];
    for (let i = 0; i < num; i++) {
      _particleList.push(this.createParticle());
    }
    this.particleList = _particleList;
  }

  createParticle() {
    return new Particle(
      this.position == -1
        ? createVector(random(width), random(height))
        : this.position.copy(),
      random(this.lifeTime - this.lifeTimeVariance, this.lifeTime),
      createVector(random(-6, 6), random(-2, 10)),
      getRandomArrayItem(this.colorPalette),
      random(this.size - this.sizeVariance, this.size)
    );
  }

  isDormant() {
    return this.particleList.length == 0;
  }

  /* create() {
    for (let i = 0; i < this.n; i++) {
      this.particleList.push(this.createParticle());
    }
  } */

  update() {
    if (this.isDormant()) return;

    let index = 0;
    for (const p of this.particleList) {
      const timeDelta = time - p.createTime;
      const maxLifeTime = p.lifeTime * timeStep;
      // if delta larger than an amount of timeStep. e.g. 100 x timeStep
      if (timeDelta > maxLifeTime) {
        this.particleList.splice(index, 1);
      }

      p.update();

      index++;
    }
  }
}
