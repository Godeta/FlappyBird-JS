class Enemy {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 40;
      this.speed = 3;
      this.wingAngle = 0;
      this.wingSpeed = 0.2;
    }
  
    update() {
      this.x -= this.speed;
      this.wingAngle += this.wingSpeed;
    }
  
    show() {
      push();
      translate(this.x, this.y);
      
      // Body
      fill(60, 60, 60);
      ellipse(0, 0, this.size * 0.6, this.size * 0.8);
      
      // Wings
      fill(40, 40, 40);
      let wingY = sin(this.wingAngle) * 5;
      
      // Left wing
      push();
      translate(-this.size * 0.3, 0);
      rotate(-PI / 6 + sin(this.wingAngle) * PI / 8);
      beginShape();
      vertex(0, 0);
      bezierVertex(
        -this.size * 0.4, -this.size * 0.5,
        -this.size * 0.6, -this.size * 0.3,
        -this.size * 0.7, this.size * 0.2
      );
      bezierVertex(
        -this.size * 0.5, this.size * 0.1,
        -this.size * 0.3, this.size * 0.05,
        0, 0
      );
      endShape(CLOSE);
      pop();
      
      // Right wing
      push();
      translate(this.size * 0.3, 0);
      rotate(PI / 6 - sin(this.wingAngle) * PI / 8);
      beginShape();
      vertex(0, 0);
      bezierVertex(
        this.size * 0.4, -this.size * 0.5,
        this.size * 0.6, -this.size * 0.3,
        this.size * 0.7, this.size * 0.2
      );
      bezierVertex(
        this.size * 0.5, this.size * 0.1,
        this.size * 0.3, this.size * 0.05,
        0, 0
      );
      endShape(CLOSE);
      pop();
      
      // Eyes
      fill(255);
      ellipse(-this.size * 0.15, -this.size * 0.1, this.size * 0.15, this.size * 0.15);
      ellipse(this.size * 0.15, -this.size * 0.1, this.size * 0.15, this.size * 0.15);
      
      fill(255, 0, 0);
      ellipse(-this.size * 0.15, -this.size * 0.1, this.size * 0.1, this.size * 0.1);
      ellipse(this.size * 0.15, -this.size * 0.1, this.size * 0.1, this.size * 0.1);
      
      // Ears
      fill(60, 60, 60);
      triangle(-this.size * 0.2, -this.size * 0.4, -this.size * 0.3, -this.size * 0.2, -this.size * 0.1, -this.size * 0.2);
      triangle(this.size * 0.2, -this.size * 0.4, this.size * 0.3, -this.size * 0.2, this.size * 0.1, -this.size * 0.2);
      
      // Fangs
      fill(255);
      triangle(-this.size * 0.1, this.size * 0.1, -this.size * 0.05, this.size * 0.2, 0, this.size * 0.1);
      triangle(this.size * 0.1, this.size * 0.1, this.size * 0.05, this.size * 0.2, 0, this.size * 0.1);
      
      pop();
    }
  
    hits(bird) {
      let d = dist(this.x, this.y, bird.x, bird.y);
      return d < this.size / 2 + 16; // Assuming bird radius is 16
    }
  
    offscreen() {
      return this.x < -this.size;
    }
  }