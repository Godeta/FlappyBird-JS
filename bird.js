function Bird() {

  this.y = height / 2;
  this.x = 25;
  this.gravity = 0.6;
  this.velocity = 0;
  this.lift = -15;

  this.show = function() {
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

  this.update = function() {
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

  this.up = function() {
    this.velocity += this.lift;
    console.log("SPACE");
  }
}