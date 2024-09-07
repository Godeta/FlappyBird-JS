class ScorePopup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 255;
    this.size = 20;
  }

  update() {
    this.y -= 2;
    this.opacity -= 5;
    this.size += 0.5;
  }

  show() {
    push();
    fill(50, 205, 50, this.opacity);
    textSize(this.size);
    textAlign(CENTER);
    text('+1', this.x, this.y);
    pop();
  }

  finished() {
    return this.opacity <= 0;
  }
}