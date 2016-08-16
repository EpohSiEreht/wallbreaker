var game = new Phaser.Game(480, 716, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});

var ball,
	paddle,
	bricks,
	newBrick,
	brickStatus,
    scoreText,
    score = 0,
    lives = 3,
    livesText,
    lifeLostText,
    playing = false,
    startButton;

function preload() {
    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.image('ball', '/assets/img/ball1.png');
    game.load.image('paddle', '/assets/img/paddle.png');
    game.load.image('brick1', '/assets/img/brick1.png');
    game.load.image('brick2', '/assets/img/brick2.png');
    game.load.image('brick3', '/assets/img/brick3.png');
    // game.load.spritesheet('ball', '/assets/img/wobble.png', 20, 20);
    game.load.spritesheet('button', '/assets/img/button.png', 120, 40);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 30, 'ball');
    // ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5,0.8);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

    textStyle = { font: '18px Arial', fill: '#0095DD' };
    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
    livesText = game.add.text(game.world.width-5, 5, 'Lives: ' + lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Tap to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}
function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    if(playing) {
        paddle.x = game.input.x || game.world.width * 0.5;
    }
}
function initBricks() {
    brickInfo = {
        width: 40,
        height: 40,
        count: {
            row: 4,
            col: 6
        },
        offset: {
            top: 100,
            left: 110
        },
        padding: 11.25
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.row; c++) {
        for(r=0; r<brickInfo.count.col; r++) {
            var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            var character = ['brick1', 'brick2', 'brick3'];
            var randomCharacter = function(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            newBrick = game.add.sprite(brickX, brickY, character[randomCharacter(0, character.length -1)]);
            newBrick.scale.setTo(0.5,0.5);
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}
function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText('Points: ' + score);
    if(score === brickInfo.count.row * brickInfo.count.col*10) {
        alert('You won the game, congratulations!');
        location.reload();
    }
}
function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Lives: ' + lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width * 0.5, game.world.height - 25);
        paddle.reset(game.world.width * 0.5, game.world.height - 5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(300, -300);
        }, this);
    }
    else {
        alert('You lost, game over!');
        location.reload();
    }
}
function ballHitPaddle(ball, paddle) {
    // ball.animations.play('wobble');
    ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}
function startGame() {
    startButton.destroy();
    ball.body.velocity.set(300, -300);
    playing = true;
}