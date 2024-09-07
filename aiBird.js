class AIBird extends Bird {
  constructor() {
    super(true); // Pass true to indicate it's an AI bird
    this.aiBird = true;
    this.reactionDistance = 250 * aiDifficulty;
    this.attackChance = 0.5 * aiDifficulty;
    this.color = color(139, 69, 19);
    this.lastJumpFrame = 0;
    this.lastBallThrowFrame = 0;
  }

  update1(pipes, enemies) {
    // print(aiDifficulty);
    switch (aiDifficulty) {
      case 1:
        this.easyBehavior(pipes, enemies);
        break;
      case 2:
        this.mediumBehavior(pipes, enemies);
        break;
      case 3:
        this.hardBehavior(pipes, enemies);
        break;
    }
    this.update();
    this.updateBalls();
  }

  easyBehavior(pipes, enemies) {
    let closestPipe = this.getClosestPipe(pipes);
    let nextPipe = this.getNextPipe(pipes, closestPipe);
    
    if (closestPipe) {
      this.avoidPipe(closestPipe, nextPipe);
    }
    
    // this.avoidEnemies(enemies);
    // this.throwBallsAtEnemies(enemies);
  }

  avoidPipe(pipe, nextPipe) {
    let gapCenter = pipe.top + pipe.spacing / 2;
    let distanceToGap = gapCenter - this.y;
    let distanceToPipe = pipe.x - this.x;
    
    // Calculate the number of frames it will take to reach the pipe
    let framesToPipe = distanceToPipe / pipe.speed;
    
    // Predict the bird's position at the pipe
    let predictedY = this.y + this.velocity * framesToPipe + 0.5 * this.gravity * framesToPipe * framesToPipe;
    
    // Calculate the safe zone
    let safeZoneTop = pipe.top + 30;
    let safeZoneBottom = height - pipe.bottom - 30;
    
    // Decide whether to jump based on the predicted position
    if (predictedY > safeZoneBottom || (predictedY > gapCenter && this.velocity > 0)) {
      if (frameCount - this.lastJumpFrame > 15) {
        this.up();
        this.lastJumpFrame = frameCount;
      }
    }
    
    // Prevent jumping too high
    if (this.y < safeZoneTop && this.velocity < 0) {
      this.velocity += this.gravity * 2;
    }
  }

    mediumBehavior(pipes) {
    // For now, use the same behavior as easy
    this.easyBehavior(pipes);
    this.throwBallsAtEnemies(enemies);
  }

  hardBehavior(pipes) {
    // For now, use the same behavior as easy
    this.easyBehavior(pipes);
  }

  throwBallsAtEnemies(enemies) {
    for (let enemy of enemies) {
      if (Math.abs(enemy.y - this.y) < 20) {
        if (frameCount - this.lastBallThrowFrame > 30) { // Add a cooldown to prevent constant throwing
          this.throwBall();
          this.lastBallThrowFrame = frameCount;
          break; // Only throw at one enemy at a time
        }
      }
    }
  }
  getNextPipe(pipes, currentPipe) {
    return pipes.find(pipe => pipe.x > currentPipe.x + currentPipe.w);
  }

  // Keep the existing helper methods
  getClosestPipe(pipes) {
    return pipes.find(pipe => pipe.x + pipe.w > this.x);
  }
  
  getClosestEnemy(enemies) {
    return enemies.reduce((closest, enemy) => {
      if (!closest || enemy.x < closest.x) return enemy;
      return closest;
    }, null);
  }

  shouldJump(pipe) {
    let futureY = this.y + this.velocity * 5; // Predict future position
    return (
      pipe.x - this.x < this.reactionDistance &&
      (futureY > pipe.top + 30 || futureY < pipe.bottom - 30)
    );
  }

  shouldAttack(enemy) {
    return (
      enemy.x - this.x < this.reactionDistance &&
      Math.abs(enemy.y - this.y) < 50 &&
      random(1) < this.attackChance
    );
  }
}
