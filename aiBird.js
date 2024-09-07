class AIBird extends Bird {
  constructor() {
    super(true); // Pass true to indicate it's an AI bird
    this.aiBird = true;
    this.reactionDistance = 150 * aiDifficulty;
    this.attackChance = 0.3 * aiDifficulty;
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
    
    if (closestPipe) {
      let gapCenter = closestPipe.top + closestPipe.spacing / 2;
      let distanceToGap = gapCenter - this.y;
      
      // Jump if the bird is below the center of the gap and not too close to the top pipe
      if (distanceToGap < -30 && this.y < height - 100 ) {
        this.up();
      }
      
      // Add some randomness to make it less perfect
      if (random(1) < 0.01 && frameCount % 60 === 0) {  // 1% chance to make a random jump, but not too often
        this.up();
      }
    }
  
    // Random ball throwing
    if (random(1) < 0.01) {  // 1% chance to throw a ball each frame
      this.throwBall();
    }
  }

  mediumBehavior(pipes, enemies) {
    // To be implemented
  }

  hardBehavior(pipes, enemies) {
    // To be implemented
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
