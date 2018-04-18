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
	this.meteorSpeedMultiplier = 8;
	this.meteorSpeedBase = 3;
	this.meteorSpawnLowest = -50;
	this.meteorSpawnRangeY = 50;
	this.meteorSpawnCenter = this.sys.game.config.width / 2;
	this.meteorSpawnRangeX = this.sys.game.config.width / 2;
	this.maxNumMeteors = 6;

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
	background.setScale(0.5);

	// TODO: Scale offset based on percent of screen height, and make that percent a constant
	this.bunker = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'bunker');
	this.bunker.setScale(3);

	this.meteors = this.add.group({
		key: 'meteor',
		repeat: this.maxNumMeteors,
		setXY: {
			x: 0,
			y: this.meteorSpawnLowest,
			stepX: 0,
			stepY: 0
		}
	});
	Phaser.Actions.ScaleXY(this.meteors.getChildren(), -0.5, -0.5);
	this.resetMeteors(this.meteors.getChildren());

	// this.input.activePointer.

	this.bullet = this.add.sprite(0, 0, 'bullet');
	this.bullet.setScale(0.2);
	this.resetBullet(this.bullet);

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

	let meteors = this.meteors.getChildren();

	// Move bullet and check for intersection with meteors
	this.bullet.y += this.bullet.speed;
	for (let i = 0; i < this.maxNumMeteors; i++) {
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), meteors[i].getBounds())) {
			this.resetMeteor(meteors[i]);
			this.resetBullet(this.bullet);
			this.score++;
			break;
		}
	}

	// Move meteor and check for intersection with bunker
	for (let i = 0; i < this.maxNumMeteors; i++) {
		meteors[i].y += meteors[i].speed;
		if (Phaser.Geom.Intersects.RectangleToRectangle(meteors[i].getBounds(), this.bunker.getBounds())) {
			this.playerHealth--;
			this.resetMeteor(meteors[i]);
		}

		// Reset meteor if it hit the ground
		if (meteors[i].y >= this.sys.game.config.height) {
			this.resetMeteor(meteors[i]);
		}
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
	this.time.delayedCall(100, function() {
		this.cameras.main.fade(400);
	}, [], this);

	// Restart game
	this.time.delayedCall(500, function() {
		this.scene.restart();
	}, [], this);
};

scene.shoot = function() {
	this.bullet.speed = this.bulletSpeed;
};

scene.resetMeteor = function(meteor) {
	meteor.x = (Math.random() - 0.5) * this.meteorSpawnRangeX + this.meteorSpawnCenter;
	meteor.y = -1 * Math.random() * this.meteorSpawnRangeY + this.meteorSpawnLowest;
	meteor.speed = Math.random() * this.meteorSpeedMultiplier + this.meteorSpeedBase;
};

scene.resetMeteors = function(meteors) {
	let len = meteors.length;
	for (let i = 0; i < len; i++) {
		this.resetMeteor(meteors[i]);
	}
};

scene.resetBullet = function(bullet) {
	bullet.x = this.sys.game.config.width / 2;
	bullet.y = this.sys.game.config.height - 200; // TODO: Scale offset based on percent of screen height
	bullet.speed = 0;
};