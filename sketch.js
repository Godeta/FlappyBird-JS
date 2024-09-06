var bird;
var pipes = [];
var enemies = [];
var score = 0;
var gameOver = false;
var scorePopups = [];
var deathCause = '';
var difficultyFactor = 1;

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
    
  bird.update();
  bird.updateBalls();
  bird.show();
  bird.showBalls();
  
  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }

  // Update difficulty factor based on score
  difficultyFactor = 1 + (score / 10) * 0.5; // Increase by 0.5 for every 10 points
  
  // Spawn enemies more frequently as score increases
  if (frameCount % Math.floor(60 / difficultyFactor) == 0) {
    spawnEnemy();
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
    else {
    // Check for ball collisions
    for (let j = bird.balls.length - 1; j >= 0; j--) {
      if (bird.balls[j].hits(enemies[i])) {
        enemies.splice(i, 1);
        bird.balls.splice(j, 1);
        score += 2; // Bonus points for killing an enemy
        break;
      }
    }
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

function spawnEnemy() {
  let spawnChance = 0.3 + (score / 20) * 0.1; // Increase spawn chance as score increases
  spawnChance = min(spawnChance, 0.8); // Cap spawn chance at 80%
  
  if (random(1) < spawnChance) {
    let enemyY = random(height * 0.2, height * 0.8); // Spawn within middle 60% of screen height
    let enemySpeed = 3 + (score / 30); // Increase enemy speed as score increases
    enemies.push(new Enemy(width, enemyY, enemySpeed));
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
      difficultyFactor = 1;
    } else {
      bird.up();
    }
  }
  else if (key == 'v' || key == 'V') {
    if (!gameOver) {
      bird.throwBall();
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