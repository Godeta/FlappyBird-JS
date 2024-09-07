let gameState = 'menu'; // 'menu', 'singlePlayer', 'aiMode', 'dualMode'
let bird;
let aiBird;
let pipes = [];
let enemies = [];
let score = 0;
let aiScore = 0;
let gameOver = false;
let scorePopups = [];
let deathCause = '';
let difficultyFactor = 1;
let aiDifficulty = 1;
let playerAlive = true;
let aiAlive = true;

function setup() {
  createCanvas(400, 500);
  resetGame();
}

function draw() {
  background(135, 206, 235); // Sky blue
  resetPipeHighlights();

  switch (gameState) {
    case 'menu':
      drawMenu();
      break;
    case 'singlePlayer':
      drawGame();
      break;
    case 'aiMode':
      drawAIGame();
      break;
    case 'dualMode':
      drawDualGame();
      break;
  }
}

function drawMenu() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text("Flappy Bird", width / 2, height / 4);

  textSize(24);
  text("Choose a mode:", width / 2, height / 2 - 80);

  drawButton("Single Player", width / 2, height / 2 - 30, () => { gameState = 'singlePlayer'; resetGame(); });
  drawButton("AI Mode", width / 2, height / 2 + 30, () => { gameState = 'aiMode'; resetGame(); });
  drawButton("Dual Mode", width / 2, height / 2 + 90, () => { gameState = 'dualMode'; resetGame(); });

  textSize(20);
  text("AI Difficulty:", width / 2, height / 2 + 150);
  drawDifficultySelector(width / 2, height / 2 + 180);
}

function drawDifficultySelector(x, y) {
  let buttonWidth = 50;
  let buttonHeight = 30;
  let spacing = 10;

  for (let i = 1; i <= 3; i++) {
    let buttonX = x + (i - 2) * (buttonWidth + spacing);
    
    if (mouseX > buttonX - buttonWidth/2 && mouseX < buttonX + buttonWidth/2 &&
        mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2) {
      fill(200);
      if (mouseIsPressed) {
        aiDifficulty = i;
      }
    } else {
      fill(aiDifficulty === i ? 150 : 255);
    }

    rect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 5);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(i, buttonX, y);
  }
}

function drawButton(label, x, y, onClick) {
  let buttonWidth = 200;
  let buttonHeight = 50;

  // Check if mouse is over the button
  if (mouseX > x - buttonWidth/2 && mouseX < x + buttonWidth/2 &&
      mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2) {
    fill(200);
    if (mouseIsPressed) {
      onClick();
    }
  } else {
    fill(255);
  }

  rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(label, x, y);
}

function drawGame() {
  if (!gameOver) {
    updateGame();
    bird.show();
    bird.showBalls();
    showPipesAndEnemies();
    displayScore();
    showScorePopups();
    showInstructions()
  } else {
    showGameOver();
  }
}

function drawAIGame() {
  if (!gameOver) {
    updateGame();
    if (aiBird) {
      aiBird.show();
    }
    showPipesAndEnemies();
    displayScore();
    showScorePopups();
    showInstructions()
  } else {
    showGameOver();
  }
}

function drawDualGame() {
  updateGame();
  if (playerAlive) {
    bird.show();
    bird.showBalls();
  }
  if (aiAlive && aiBird) {
    aiBird.show();
  }
  showPipesAndEnemies();
  displayDualScore();
  showScorePopups();
  showInstructions()
  
  if (gameOver) {
    showGameOver();
  }
}

function updateGame() {
  // Update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    
    if (playerAlive && gameState !== 'aiMode' && pipes[i].pass(bird)) {
      score++;
      scorePopups.push(new ScorePopup(bird.x, bird.y));
    }
    
    if (aiAlive && aiBird && gameState === 'dualMode' && pipes[i].pass(aiBird)) {
      aiScore++;
    }
    
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // Spawn new pipes
  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    if (enemies[i].offscreen()) {
      enemies.splice(i, 1);
    }
  }

  // Spawn new enemies
  if (frameCount % Math.floor(60 / difficultyFactor) === 0) {
    spawnEnemy();
  }

  // Update birds
  if (playerAlive && (gameState === 'singlePlayer' || gameState === 'dualMode')) {
    bird.update();
  }
  if (aiAlive && aiBird && (gameState === 'aiMode' || gameState === 'dualMode')) {
    aiBird.update1(pipes, enemies);
  }

  // Check collisions
  checkCollisions();

  // Update difficulty factor based on score
  difficultyFactor = 1 + (score / 10) * 0.5; // Increase by 0.5 for every 10 points
}

function showPipesAndEnemies() {
  push(); // Save the current drawing state
  for (let pipe of pipes) {
    pipe.show();
  }
  for (let enemy of enemies) {
    enemy.show();
  }
  pop(); // Restore the drawing state
}

function displayScore() {
  textSize(32);
  fill(0);
  text(`Score: ${score}`, width / 2, 50);
}

function displayDualScore() {
  textSize(24);
  fill(0);
  text(`Player: ${score}  AI: ${aiScore}`, width / 2, 30);
}

function showGameOver() {
  background(0, 0, 0, 200);
  fill(255);
  textSize(64);
  textAlign(CENTER);
  text('Game Over', width / 2, height / 2 - 120);
  
  textSize(32);
  if (gameState === 'dualMode') {
    if (deathCause === 'both') {
      text('Both birds crashed!', width / 2, height / 2 - 40);
    } else if (!playerAlive) {
      text('Player bird crashed!', width / 2, height / 2 - 40);
    } else {
      text('AI bird crashed!', width / 2, height / 2 - 40);
    }
    text(`Player Score: ${score}`, width / 2, height / 2);
    text(`AI Score: ${aiScore}`, width / 2, height / 2 + 40);
  } else {
    if (deathCause === 'enemy') {
      text('You were killed by an enemy!', width / 2, height / 2 - 40);
    } else if (deathCause === 'pipe') {
      text('You hit a pipe!', width / 2, height / 2 - 40);
    }
    text(`Score: ${score}`, width / 2, height / 2);
  }
  
  textSize(24);
  text('Press SPACE to restart', width / 2, height / 2 + 80);
  text('Press R to return to menu', width / 2, height / 2 + 110);
}

function resetGame() {
  bird = new Bird();
  aiBird = (gameState === 'aiMode' || gameState === 'dualMode') ? new AIBird() : null;
  pipes = [];
  enemies = [];
  score = 0;
  aiScore = 0;
  gameOver = false;
  scorePopups = [];
  deathCause = '';
  playerAlive = true;
  aiAlive = (gameState === 'aiMode' || gameState === 'dualMode');
}

function keyPressed() {
  if ((gameState === 'singlePlayer' || gameState === 'dualMode') && !gameOver) {
    if (key === ' ') {
      bird.up();
    } else if (key === 'v' || key === 'V') {
      bird.throwBall();
    }
    else if (key === 'r' || key === 'R') {
      resetGame();
      gameState = 'menu';
    }
  } else if (gameOver && (key === ' ' || key === 'r' || key === 'R')) {
    if (key === ' ') {
      resetGame();
    } else {
      gameState = 'menu';
    }
  }
}

function keyReleased() {
  if (key === ' ' && (gameState === 'singlePlayer' || gameState === 'dualMode') && !gameOver) {
    bird.velocity *= 0.6;
    if (bird.velocity > 0) bird.velocity = -2;
  }
}

function showInstructions() {
  push();
  fill(0);
  textAlign(LEFT);
  textSize(16);
  text('Press SPACE to jump', 10, height - 60);
  text('Press V to throw balls', 10, height - 40);
  text('Press R to return to menu', 10, height - 20);
  pop();
}

function mousePressed() {
  if (gameState === 'menu') {
    // Handle menu clicks (already handled in drawButton)
  }
}

function spawnEnemy() {
  let spawnChance = 0.3 + (score / 20) * 0.1;
  spawnChance = min(spawnChance, 0.8);
  
  if (random(1) < spawnChance) {
    let enemyY = random(height * 0.2, height * 0.8);
    let enemySpeed = 3 + (score / 30);
    enemies.push(new Enemy(width, enemyY, enemySpeed));
  }
}

function checkCollisions() {
  for (let pipe of pipes) {
    if (playerAlive && pipe.hits(bird)) {
      if (gameState !== 'dualMode' || !aiAlive) {
        gameOver = true;
        deathCause = 'pipe';
      } else {
        playerAlive = false;
      }
    }
    
    if (aiAlive && aiBird && pipe.hits(aiBird)) {
      if (gameState === 'aiMode' || (gameState === 'dualMode' && !playerAlive)) {
        gameOver = true;
        deathCause = 'pipe';
      } else if (gameState === 'dualMode') {
        aiAlive = false;
        aiBird = null;
      }
    }
  }

  for (let enemy of enemies) {
    if (playerAlive && enemy.hits(bird)) {
      if (gameState !== 'dualMode' || !aiAlive) {
        gameOver = true;
        deathCause = 'enemy';
      } else {
        playerAlive = false;
      }
    }
    
    if (aiAlive && aiBird && enemy.hits(aiBird)) {
      if (gameState === 'aiMode' || (gameState === 'dualMode' && !playerAlive)) {
        gameOver = true;
        deathCause = 'enemy';
      } else if (gameState === 'dualMode') {
        aiAlive = false;
        aiBird = null;
      }
    }
  }

  // Check for ball collisions with enemies
  if (playerAlive) checkBallCollisions(bird);
  if (aiAlive && aiBird) checkBallCollisions(aiBird);

  // Check if both birds are dead in dual mode
  if (gameState === 'dualMode' && !playerAlive && !aiAlive) {
    gameOver = true;
    deathCause = 'both';
  }
}

function checkBallCollisions(bird) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bird.balls.length - 1; j >= 0; j--) {
      if (bird.balls[j].hits(enemies[i])) {
        enemies.splice(i, 1);
        bird.balls.splice(j, 1);
        if (bird === this.bird) {
          score += 2;
        } else {
          aiScore += 2;
        }
        break;
      }
    }
  }
}

function showScorePopups() {
  push(); // Save the current drawing state
  for (let i = scorePopups.length - 1; i >= 0; i--) {
    scorePopups[i].update();
    scorePopups[i].show();
    if (scorePopups[i].finished()) {
      scorePopups.splice(i, 1);
    }
  }
  pop(); // Restore the drawing state
}

function resetPipeHighlights() {
  for (let pipe of pipes) {
    pipe.highlight = false;
  }
}

