
// Create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// Our game's configuration
let config = {
	type: Phaser.AUTO,  // Phaser will decide how to render our game (WebGL or Canvas)
	width: 640, // game width
	height: 360, // game height
    scene: gameScene // our newly created scene
};

// Create the game, and pass it the configuration
let game = new Phaser.Game(config);


gameScene.init = function() {
	this.playerSpeed = 1.5;
	this.enemyMaxY = 280;
	this.enemyMinY = 80;
};

// Load asset files for our game
gameScene.preload = function() {
	this.load.image('background', 'assets/background.png');
	this.load.image('player', 'assets/player.png');
	this.load.image('dragon', 'assets/dragon.png');
	this.load.image('treasure', 'assets/treasure.png');
};

// Executed once, after assets were loaded
gameScene.create = function() {
	let background = this.add.sprite(0, 0, 'background');
	background.setOrigin(0, 0);

	this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
	this.player.setScale(0.5); // Set image scale to half size
	this.isPlayerAlive = true;

	this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
	this.treasure.setScale(0.6);

	this.enemies = this.add.group({
		key: 'dragon',
		repeat: 5,
		setXY: {
			x: 110,
			y: 100,
			stepX: 80,
			stepy: 20
		}
	});
	Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
	Phaser.Actions.call(this.enemies.getChildren(), function(enemy) {
		enemy.speed = Math.random() * 2 + 1;
	}, this);

	this.cameras.main.resetFX();
};

gameScene.update = function() {
	if (!this.isPlayerAlive) return;


	if (this.input.activePointer.isDown) {
		this.player.x += this.playerSpeed;
	}

	// End game when player touches treasure (currently restarts scene)
	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
		this.gameOver();
	}

	let enemies = this.enemies.getChildren();
	let numEnemies = enemies.length;
	for (let i = 0; i < numEnemies; i++) {
		enemies[i].y += enemies[i].speed;

		// Reverse movement when it hits an edge
		if ((enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0)
			|| enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {

			enemies[i].speed *= -1;
		}

		// End game when player collides with enemy
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
			this.gameOver();
			break;
		}
	}
};

gameScene.gameOver = function() {
	this.isPlayerAlive = false;
	this.cameras.main.shake(500);

	// Fade camera
	this.time.delayedCall(250, function() {
		this.cameras.main.fade(250);
	}, [], this);

	// Restart game
	this.time.delayedCall(500, function() {
		this.scene.restart();
	}, [], this);
};
