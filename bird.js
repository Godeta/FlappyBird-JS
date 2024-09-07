class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 10;
    this.balls = [];
    this.aiBird = false;

    // New variables for smoother movement
    this.jumpForce = -20;
    this.maxVelocity = 10;
    this.smoothness = 0.9; // Value between 0 and 1, higher means smoother
  }

  show = function() {
    push();
    translate(this.x, this.y);
    
    // Body
    fill(255, 0, 0); // Red
    if(this.aiBird) {
      fill(139, 69, 19); // Brown color for AI bird
    }
    noStroke();
    ellipse(0, 0, 32, 24);
    
    // Wing
    fill(200, 0, 0); // Darker red
    if(this.aiBird) {
      fill(50, 69, 19); // for AI bird
    }
    let wingY = sin(frameCount * 0.3) * 3; // Wing flap animation
    ellipse(0, wingY, 20, 15);
    
    // Eye
    fill(255);
    ellipse(10, -5, 10, 10);
    fill(0);
    ellipse(12, -5, 4, 4);
    
    // Beak
    fill(255, 165, 0); // Orange
    if(this.aiBird) {
      fill(139, 255, 19); 
    }
    triangle(15, 0, 25, -3, 25, 3);
    
    pop();
  }

  update = function() {
    // Apply gravity
    this.velocity += this.gravity;
    
    // Limit maximum falling speed
    this.velocity = constrain(this.velocity, -this.maxVelocity, this.maxVelocity);
    
    // Apply smoothing to the velocity
    this.velocity *= this.smoothness;
    
    // Update position
    this.y += this.velocity;

    // Constrain bird to screen
    this.y = constrain(this.y, 0, height);

    this.updateBalls();
  }

  up = function() {
    // Apply an immediate upward force
    this.velocity += this.jumpForce;
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