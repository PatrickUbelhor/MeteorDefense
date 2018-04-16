// Create a new scene named "Game"
let scene = new Phaser.Scene('Game');

// Our game's configuration
let config = {
	type: Phaser.AUTO,  // Phaser will decide how to render our game (WebGL or Canvas)
	width: 1280, // game width
	height: 720, // game height
	scene: scene // our newly created scene
};

let game = new Phaser.Game(config);


/**
 * Used to initialize custom variables.
 */
scene.init = function() {
	// Constants
	this.bulletSpeed = -20;
	this.meteorSpeedMultiplier = 10;
	// this.maxNumMeteors = 6;

	// Variables
	this.score = 0;
	this.playerHealth = 10;
};

/**
 * Buffers the images/assets for future use.
 */
scene.preload = function() {
	this.load.image('background', 'assets/background.png');
	this.load.image('bullet', 'assets/player.png');
	this.load.image('meteor', 'assets/dragon.png');
	this.load.image('bunker', 'assets/treasure.png');
};

/**
 * Places initial objects on the scene (runs once).
 */
scene.create = function() {
	let background = this.add.sprite(0, 0, 'background');
	background.setOrigin(0, 0);
	background.setScale(2);

	// TODO: Scale offset based on percent of screen height, and make that percent a constant
	this.bunker = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'bunker');
	this.bunker.scaleX(4);
	this.bunker.scaleY(3);

	this.meteor = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'meteor');
	this.meteor.setScale(0.5);
	this.meteor.speed = Math.random() * this.meteorSpeedMultiplier + 2;
	this.meteor.isAlive = true;

	// TODO: Scale offset based on percent of screen height, and make that percent a constant
	this.bullet = this.addSprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'bullet');
	this.bullet.speed = 0;

	this.cameras.main.resetFX();
	this.playerHealth = 10;
	this.score = 0;
};

/**
 * Runs once every time the screen is refreshed (optimally 60Hz). Important
 * to isolate timing from iteration count.
 */
scene.update = function() {
	if (this.playerHealth <= 0) {
		return;
	}

	this.bullet.y += this.bullet.speed;
	// if (Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), this.meteor.getBounds())) {
	// 	this.meteor.y = this.sys.game.config.height / 2;
	// 	this.bullet.y = this.sys.game.config.height - 80; // TODO: Scale with display
	// 	this.bullet.speed = 0;
	// }
	// this.input.onDown.add(this.shoot, this);

	// Move meteor and check for intersection with bunker
	this.meteor.y += this.meteor.speed;
	if (Phaser.Geom.Intersects.RectangleToRectangle(this.meteor.getBounds(), this.bunker.getBounds())) {
		this.playerHealth--; // If meteor collides with bunker, reduce player health
		this.meteor.x = 0;
	}

	// End if health is 0
	if (this.playerHealth <= 0) {
		this.gameOver();
	}
};

/**
 * Called in scene.update() when the player has lost.
 */
scene.gameOver = function() {
	// Fade camera
	this.time.delayedCall(250, function() {
		this.cameras.main.fade(250);
	}, [], this);

	// Restart game
	this.time.delayedCall(500, function() {
		this.scene.restart();
	}, [], this);
};

scene.shoot = function() {
	this.bullet.speed = this.bulletSpeed;
};