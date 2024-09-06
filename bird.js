class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 25;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
    this.balls = [];
  }

  show = function() {
    push();
    translate(this.x, this.y);
    
    // Body
    fill(255, 0, 0); // Red
    noStroke();
    ellipse(0, 0, 32, 24);
    
    // Wing
    fill(200, 0, 0); // Darker red
    let wingY = sin(frameCount * 0.3) * 3; // Wing flap animation
    ellipse(0, wingY, 20, 15);
    
    // Eye
    fill(255);
    ellipse(10, -5, 10, 10);
    fill(0);
    ellipse(12, -5, 4, 4);
    
    // Beak
    fill(255, 165, 0); // Orange
    triangle(15, 0, 25, -3, 25, 3);
    
    pop();
  }

  update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  up = function() {
    this.velocity += this.lift;
    console.log("SPACE");
  }

  throwBall() {
    this.balls.push(new Ball(this.x, this.y));
  }

  updateBalls() {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      this.balls[i].update();
      if (this.balls[i].offscreen()) {
        this.balls.splice(i, 1);
      }
    }
  }

  showBalls() {
    for (let ball of this.balls) {
      ball.show();
    }
  }
}