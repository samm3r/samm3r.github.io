
class Character {
    constructor(sprite, col, row){
        this.sprite = sprite;
        this.x = (col * 100) - 100;
        this.y = (row * 83) - 98;
    }

    // Draw all characters on the screen, required method for game
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Enemies our player must avoid
class Enemy extends Character {
    constructor(sprite, col, row, speed){
        super(sprite, col, row);
        this.speed = speed;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(player, dt){

        this.enemyPosition(player, this, dt);
        
    }

    enemyPosition(player, enemy, dt){
        const boardArea = 505 + 101 // board width + enemy width
        const enemyReset = -101 // Send enemy back to the position x = -101

        // Check if the game if the player didn't lost the game
        if (player.lose === false){

            let level = (player.score / 4000) + 1; // Make the enemies faster based on the player score
            let enemyMovement = enemy.x + enemy.speed * level * dt; 

            // Reset enemy position if he is out of the board
            enemy.x = (enemy.x <= boardArea) ? enemyMovement : enemyReset;

            // Check if the player collides with and enemy and didn't lose the round yet
            if (player.loseRound === false && this.checkCollision(player, this)) {
                player.loseRound = true;
                setTimeout(() => {
                    player.loseGame();
                    this.resetEnemy();
                }, 5);
            }
        }
    }

    //Return True if the player collides with an enemy
    checkCollision(player, enemy){
        const playerX = player.x + 27;
        const playerXend = player.x + 74;
        const enemyX = enemy.x + 20;
        const enemyXend = enemy.x + 80;

        const playerY = player.y + 107; // Get the y center of the player
        const enemyY = enemy.y + 77;
        const enemyYend = enemy.y + 145;

        if (  
            ( enemyY < playerY && enemyYend > playerY ) &&
            ( ( enemyXend > playerX  && enemyX < playerX ) || ( enemyX < playerXend && enemyXend > playerXend ) ) 
            ) {
            return true;
        }
    }

    // Reset Enemy position
    resetEnemy(){
        this.x = -100;
    }
}

// Your player
class Player extends Character {
    constructor(sprite, spriteL, col = 3, row = 6){
        super(sprite, col, row);
        this.spriteR = sprite;
        this.spriteL = spriteL;
        this.lives = 3;
        this.score = 0;
        this.lose = false;
        this.loseRound = false;
        this.win = false;
    }

    // HandleInputMethod
    handleInput(mov){
        if (this.lose === false){

            switch (mov) {
                case 'right':
                    this.x = (this.x <= 300) ? this.x + 100 : this.x;
                    this.sprite = this.spriteR;
                    break;

                case 'left':
                    this.x = (this.x >= 100) ? this.x - 100 : this.x;
                    this.sprite = this.spriteL;
                    break;

                case 'down':
                    this.y = (this.y <= 317) ? this.y + 83 : this.y;
                    break;

                case 'up':
                    this.y = (this.y >= 68) ? this.y - 83 : this.y;
                    break;
            }
        }

        if(this.lose === true && mov === 'enter'){
            this.restartGame();
        }

        // Win the game when the player achieves the first row
        if (this.y <= 0 && this.win === false) {
            this.winGame();
        }
    }

    // Update the player's position, required method for game
    update(dt){

    }

    // Detect when the player wins a round
    // increase the score and send him back to the origin
    winGame(){
        this.score += 100;
        this.win = true;

        setTimeout(() => {
            // this.win = true;
            this.resetPlayer();
        }, 200);
    }

    // Detect when the player loses the game
    // decrease lives and send him back to the origin
    loseGame(){
        this.lives--;
        this.resetPlayer();

        // Check if the player has insificient lives and make him lose the game
        if (this.lives === -1) {
            this.lose = true;
        }
    }

    // Send the player back to
    // the initial position
    resetPlayer(){
        this.x = 200;
        this.y = 400;
        this.loseRound = false;
        this.win = false;
    }

    // Restart the game variables
    restartGame(){
        this.resetPlayer();
        this.lives = 3;
        this.score = 0;
        this.lose = false;
        this.loseRound = false;
        this.win = false;
    }

}


function screenMessages(player){
    //Print a message when the player lose the game
    if (player.lose === true){
        ctx.beginPath();        
        ctx.fillStyle = "rgba(0,0,0,0.88)";
        ctx.fillRect(0, 50, 505, 536);
        ctx.closePath();

        ctx.fillStyle = "White";
        ctx.textAlign = "center";
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 3;

        ctx.font = "68pt Fugaz One"; // You Lose
        ctx.fillText(`You Lose`, 250, 150);

        ctx.font = "20pt Fugaz One"; // Your Score
        ctx.fillText(`Your score: ${player.score}`, 250, 200);

        ctx.fillStyle = "#F8E71C"; // Press Enter to restart
        ctx.font = "22pt Fugaz One";
        ctx.fillText(`Press ENTER to restart`, 250, 290);

        ctx.drawImage(Resources.get('images/img-losegame.png'), 0, 324); // Bender image
    }

    //Print player score on the screen
    ctx.fillStyle = "White";
    ctx.textAlign = "left"; 
    ctx.font = "16pt Fugaz One";
    ctx.strokeText(`Score: ${player.score}`, 20, 36); // Player Score
    ctx.fillText(`Score: ${player.score}`,20,36); // Player Score Stroke

    //Print player lives on the screen
    if (player.lives > 0){
        let beer = 460;
        for (let i = 0; i < player.lives; i++) {
        ctx.drawImage(Resources.get('images/game-beer.png'), beer, 0);
        beer = beer - 30;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player('images/char-bender-right.png', 'images/char-bender-left.png');

let allEnemies = [
    new Enemy('images/enemy-kodo.png', -2, 2, 230),
    new Enemy('images/enemy-blob.png', -5, 3, 190),
    new Enemy('images/enemy-alien.png', -1, 4, 170),
    new Enemy('images/enemy-alien.png', -10, 2, 280),
    new Enemy('images/enemy-roberto.png', -12, 3, 210),
    new Enemy('images/enemy-devil.png', -15, 4, 230),
    new Enemy('images/enemy-blob.png', -22, 2, 150),
    ];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});