var bird;
var pipes = [];
var enemies = [];
var score = 0;
var gameOver = false;
var scorePopups = [];
var deathCause = '';

function setup() {
  createCanvas(400, 500);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  // Draw background
  background(135, 206, 235); // Sky blue
  
  // Draw sun
  fill(255, 255, 0);
  noStroke();
  circle(350, 50, 70);
  
  // Draw clouds
  fill(255);
  ellipse(100, 50, 70, 50);
  ellipse(130, 50, 60, 40);
  ellipse(160, 50, 55, 35);
  
  ellipse(300, 100, 70, 50);
  ellipse(330, 100, 60, 40);
  ellipse(360, 100, 55, 35);
  
  // Draw ground
  fill(76, 175, 80);
  rect(0, height - 20, width, 20);

  bird.update();
  bird.show();
  
  if (frameCount %100 ==0) {
    pipes.push(new Pipe() );
  }
  
  for (var i=pipes.length-1; i>=0; i--) {
   pipes[i].show();
   pipes[i].update();
    if(pipes[i].offscreen() ) {
      pipes.splice(i,1);
    }
    if(pipes[i].hits(bird)) {
      gameOver = true;
      deathCause = 'pipe';
    }
    if (pipes[i].pass(bird)) {
      score++;
      scorePopups.push(new ScorePopup(bird.x, bird.y));
      
      // Chance to spawn an enemy
      if (random(1) < 0.3) { // 30% chance
        let enemyY = random(height);
        enemies.push(new Enemy(width, enemyY));
      }
    }
  }
  
  // Handle enemies
  for (var i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    if (enemies[i].hits(bird)) {
      gameOver = true;
      deathCause = 'enemy';
    }

    if (enemies[i].offscreen()) {
      enemies.splice(i, 1);
    }
  }
  
  // Update and display score popups
  for (var i = scorePopups.length - 1; i >= 0; i--) {
    scorePopups[i].update();
    scorePopups[i].show();
    if (scorePopups[i].finished()) {
      scorePopups.splice(i, 1);
    }
  }
  
  // Display score
  textSize(32);
  textAlign(CENTER);
  
  // Text shadow
  fill(0, 0, 0, 100);
  text('Score: ' + score, width / 2 + 2, 52);
  
  // Main text
  fill(255);
  stroke(0);
  strokeWeight(4);
  text('Score: ' + score, width / 2, 50);
  noStroke();

  if (!gameOver) {
    // ... existing game code ...
  } else {
    // Game over screen
    background(0, 0, 0, 200);
    fill(255);
    textSize(64);
    textAlign(CENTER);
    if (deathCause === 'enemy') {
      text('Killed by Enemy!', width / 2, height / 2 - 50);
    } else {
      text('Game Over', width / 2, height / 2 - 50);
    }
    textSize(32);
    text('Score: ' + score, width / 2, height / 2 + 50);
    text('Press SPACE to restart', width / 2, height / 2 + 100);
  }
}

function keyPressed() {
  if (key == ' ') {
    if (gameOver) {
      // Restart game
      bird = new Bird();
      pipes = [];
      enemies = [];
      score = 0;
      gameOver = false;
      deathCause = '';
    } else {
      bird.up();
    }
  }
}

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