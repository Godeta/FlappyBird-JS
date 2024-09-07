function Pipe() {
    this.spacing = 125; // Minimum space between pipes
    this.top = random(height / 6, 3 / 4 * height - this.spacing);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 80;
    this.speed = 2;
    this.highlight = false;
    this.passed = false;
  
    this.show = function() {
      fill(0, 204, 0); // Green color for pipes
      if (this.highlight) {
        fill(255, 0, 0); // Red when hit
      }
      
      // Top pipe
      rect(this.x, 0, this.w, this.top);
      rect(this.x - 5, this.top - 20, this.w + 10, 20);
      
      // Bottom pipe
      rect(this.x, height - this.bottom, this.w, this.bottom);
      rect(this.x - 5, height - this.bottom, this.w + 10, 20);
    }

    this.update = function() {
      this.x -= this.speed;
    }

    this.offscreen = function() {
      return this.x < -this.w;
    }

    this.hits = function(bird) {
      if (bird.y < this.top || bird.y > height - this.bottom) {
        if (bird.x > this.x && bird.x < this.x + this.w) {
          this.highlight = true;
          return true;
        }
      }
      return false;
    }

    this.pass = function(bird) {
      if (!this.passed && bird.x > this.x + this.w) {
        this.passed = true;
        return true;
      }
      return false;
    }
}