class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.speed = 5;
  }

  update() {
    this.x += this.speed;
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.r + enemy.size / 2;
  }

  offscreen() {
    return this.x > width;
  }
}
