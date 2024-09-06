class Enemy {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 30;
      this.speed = 3;
    }
  
    update() {
      this.x -= this.speed;
    }
  
    show() {
      push();
      fill(255, 0, 0);
      noStroke();
      triangle(
        this.x, this.y,
        this.x - this.size / 2, this.y + this.size,
        this.x + this.size / 2, this.y + this.size
      );
      pop();
    }
  
    hits(bird) {
      let d = dist(this.x, this.y + this.size / 2, bird.x, bird.y);
      return d < this.size / 2 + 16; // Assuming bird radius is 16
    }
  
    offscreen() {
      return this.x < -this.size;
    }
  }